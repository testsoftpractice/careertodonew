import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { ProjectApprovalStatus, ProjectStatus } from '@prisma/client'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/projects - List all projects pending approval
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can access this endpoint')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ProjectApprovalStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}

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
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            major: true,
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          take: 5,
        },
        approvals: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            investments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get counts
    const totalCount = await db.project.count({ where })
    const pendingCount = await db.project.count({
      where: { approvalStatus: 'PENDING' }
    })
    const underReviewCount = await db.project.count({
      where: { approvalStatus: 'UNDER_REVIEW' }
    })
    const approvedCount = await db.project.count({
      where: { approvalStatus: 'APPROVED' }
    })

    return successResponse({
      projects,
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

    if (currentUser.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can approve projects')
    }

    const body = await request.json()
    const { projectId, publishImmediately, comments } = body

    if (!projectId) {
      return errorResponse('Project ID is required', 400)
    }

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
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
