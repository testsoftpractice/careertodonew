import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { ProjectApprovalStatus, ProjectStatus } from '@/lib/constants'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/projects - List all projects pending approval
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN' && currentUser.role !== 'UNIVERSITY_ADMIN') {
      return forbidden('Only platform admins or university admins can access this endpoint')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ProjectApprovalStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}

    // University admins can only see their university's projects
    if (currentUser.role === 'UNIVERSITY_ADMIN' && currentUser.universityId) {
      where.universityId = currentUser.universityId
    }

    if (status) {
      where.approvalStatus = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ]
    }

    // Get projects with approval status
    const projects = await db.project.findMany({
      where,
      include: {
        _count: {
          select: {
            ProjectMember: true,
            Task: true,
            Milestone: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            University: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            major: true,
          },
        },
        University: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        ProjectMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          take: 5,
        },
        ProjectApproval: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get counts - also filter by university for UNIVERSITY_ADMIN
    const universityFilter: any = {}
    if (currentUser.role === 'UNIVERSITY_ADMIN' && currentUser.universityId) {
      universityFilter.universityId = currentUser.universityId
    }

    const totalCount = await db.project.count({ where })
    const pendingCount = await db.project.count({
      where: { approvalStatus: 'PENDING', ...universityFilter }
    })
    const underReviewCount = await db.project.count({
      where: { approvalStatus: 'UNDER_REVIEW', ...universityFilter }
    })
    const approvedCount = await db.project.count({
      where: { approvalStatus: 'APPROVED', ...universityFilter }
    })
    const rejectedCount = await db.project.count({
      where: { approvalStatus: 'REJECTED', ...universityFilter }
    })
    const requireChangesCount = await db.project.count({
      where: { approvalStatus: 'REQUIRE_CHANGES', ...universityFilter }
    })

    // Transform projects to match frontend expectations
    const transformedProjects = projects.map((project: any) => ({
      ...project,
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      approvalStatus: project.approvalStatus,
      submissionDate: project.submissionDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      category: project.category,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      // Transform User -> owner
      owner: project.User ? {
        id: project.User.id,
        name: project.User.name,
        email: project.User.email,
        avatar: project.User.avatar,
      } : null,
      // Transform University -> university
      university: project.University ? {
        id: project.University.id,
        name: project.University.name,
        code: project.University.code,
      } : null,
      // Transform _count
      _count: project._count ? {
        members: project._count.ProjectMember,
        tasks: project._count.Task,
        milestones: project._count.Milestone,
      } : { members: 0, tasks: 0, milestones: 0 },
      // Remove original fields to avoid confusion
      User: undefined,
      University: undefined,
    }))

    return successResponse({
      projects: transformedProjects,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        pending: pendingCount,
        underReview: underReviewCount,
        approved: approvedCount,
        rejected: rejectedCount,
        requireChanges: requireChangesCount,
        total: totalCount,
      },
    })
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get project approvals error:', error)
    return errorResponse('Failed to fetch project approvals', 500)
  }
}

// POST /api/admin/approvals/projects - Approve a project
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN' && currentUser.role !== 'UNIVERSITY_ADMIN') {
      return forbidden('Only platform admins or university admins can approve projects')
    }

    const body = await request.json()
    const { projectId, publishImmediately, comments } = body

    if (!projectId) {
      return errorResponse('Project ID is required', 400)
    }

    // Check if project exists and user has access
    const where: any = { id: projectId }
    if (currentUser.role === 'UNIVERSITY_ADMIN' && currentUser.universityId) {
      where.universityId = currentUser.universityId
    }

    const project = await db.project.findFirst({
      where,
      include: {
        User: true,
      },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // Update project approval status
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: currentUser.id,
        reviewComments: comments || null,
        terminationReason: null,
        status: publishImmediately ? 'ACTIVE' : 'FUNDING',
        published: publishImmediately ? true : undefined,
        publishedAt: publishImmediately ? new Date() : undefined,
      },
    })

    // Create approval record
    const approval = await db.projectApproval.create({
      data: {
        projectId: projectId,
        adminId: currentUser.id,
        status: 'APPROVED',
        comments: comments || null,
      },
    })

    // Award points to project owner
    await db.user.update({
      where: { id: project.ownerId },
      data: {
        totalPoints: { increment: 100 },
        executionScore: { increment: 10 },
        collaborationScore: { increment: 10 },
        leadershipScore: { increment: 10 },
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: 'PROJECT_APPROVAL',
        title: '🎉 Project Approved!',
        message: `Your project "${project.name}" has been approved${publishImmediately ? ' and published' : ''}.`,
        link: `/projects/${projectId}`,
      },
    })

    // Notify team members
    if (project.seekingInvestment) {
      await db.notification.create({
        data: {
          userId: project.ownerId,
          type: 'PROJECT_UPDATE',
          title: '💰 Investment Ready',
          message: `Your project "${project.name}" is now visible to investors!`,
          link: `/projects/${projectId}/investment`,
        },
      })
    }

    return successResponse(
      {
        project: updatedProject,
        approval,
      },
      'Project approved successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Approve project error:', error)
    return errorResponse('Failed to approve project', 500)
  }
}
