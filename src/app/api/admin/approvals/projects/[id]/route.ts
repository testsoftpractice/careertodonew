import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { ProjectApprovalStatus } from '@/lib/constants'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/projects/[id] - Get project details for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN' && currentUser.role !== 'UNIVERSITY_ADMIN') {
      return forbidden('Only platform admins or university admins can access this endpoint')
    }

    const { id } = await params

    // Build where clause - university admins can only see their university's projects
    const where: any = { id }
    if (currentUser.role === 'UNIVERSITY_ADMIN' && currentUser.universityId) {
      where.universityId = currentUser.universityId
    }

    // Get project with full details
    const project = await db.project.findFirst({
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
            bio: true,
            location: true,
            major: true,
            graduationYear: true,
            University: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
            executionScore: true,
            collaborationScore: true,
            leadershipScore: true,
            totalPoints: true,
          },
        },
        University: true,
        ProjectMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        Task: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            TaskAssignee: {
              include: {
                User: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        Milestone: {
          take: 10,
          orderBy: { dueDate: 'asc' },
        },
        Investment: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        ProjectApproval: {
          orderBy: { createdAt: 'desc' },
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // Transform project data to match frontend expectations
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      approvalStatus: project.approvalStatus,
      submissionDate: project.submissionDate,
      approvedAt: project.approvedAt,
      rejectionReason: project.terminationReason,
      reviewComments: project.reviewComments,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      category: project.category,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      seekingInvestment: project.seekingInvestment,
      investmentGoal: project.investmentGoal,
      published: project.published,
      // Transform User -> owner
      owner: project.User ? {
        id: project.User.id,
        name: project.User.name,
        email: project.User.email,
        avatar: project.User.avatar,
        major: project.User.major,
        university: project.User.University ? {
          id: project.User.University.id,
          name: project.User.University.name,
        } : null,
      } : null,
      // Transform University -> university
      university: project.University ? {
        id: project.University.id,
        name: project.University.name,
        code: project.University.code,
      } : null,
      // Transform ProjectMember -> members
      members: project.ProjectMember.map((member: any) => ({
        id: member.id,
        user: member.User,
        role: member.role,
      })),
      // Transform Task -> tasks
      tasks: project.Task.map((task: any) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      })),
      // Transform Milestone -> milestones
      milestones: project.Milestone.map((milestone: any) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        status: milestone.status,
        dueDate: milestone.dueDate,
      })),
      // Transform _count
      _count: project._count ? {
        members: project._count.ProjectMember,
        tasks: project._count.Task,
        milestones: project._count.Milestone,
      } : { members: 0, tasks: 0, milestones: 0 },
    }

    return successResponse(transformedProject)
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get project for approval error:', error)
    return errorResponse('Failed to fetch project details', 500)
  }
}

// PATCH /api/admin/approvals/projects/[id] - Reject a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN' && currentUser.role !== 'UNIVERSITY_ADMIN') {
      return forbidden('Only platform admins or university admins can reject projects')
    }

    const { id } = await params
    const body = await request.json()
    const { rejectionReason, reviewComments } = body

    if (!rejectionReason) {
      return errorResponse('Rejection reason is required', 400)
    }

    // Check if project exists and user has access
    const where: any = { id }
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
      where: { id },
      data: {
        approvalStatus: 'REJECTED',
        terminationReason: rejectionReason,
        reviewComments: reviewComments || null,
        status: 'CANCELLED',
      },
    })

    // Create approval record
    const approval = await db.projectApproval.create({
      data: {
        projectId: id,
        adminId: currentUser.id,
        status: 'REJECTED',
        comments: `${rejectionReason}\n\n${reviewComments || ''}`.trim(),
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: 'PROJECT_APPROVAL',
        title: '❌ Project Not Approved',
        message: `Your project "${project.name}" was not approved. Reason: ${rejectionReason}`,
        link: `/projects/${id}`,
      },
    })

    return successResponse(
      {
        project: updatedProject,
        approval,
      },
      'Project rejected successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Reject project error:', error)
    return errorResponse('Failed to reject project', 500)
  }
}
// PUT /api/admin/approvals/projects/[id] - Request changes to a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (currentUser.role !== 'PLATFORM_ADMIN' && currentUser.role !== 'UNIVERSITY_ADMIN') {
      return forbidden('Only platform admins or university admins can request changes')
    }

    const { id } = await params
    const body = await request.json()
    const { reviewComments } = body

    if (!reviewComments) {
      return errorResponse('Review comments are required', 400)
    }

    // Check if project exists and user has access
    const where: any = { id }
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
      where: { id },
      data: {
        approvalStatus: 'REQUIRE_CHANGES',
        reviewComments: reviewComments,
        terminationReason: null,
        status: 'ON_HOLD',
      },
    })

    // Create approval record
    const approval = await db.projectApproval.create({
      data: {
        projectId: id,
        adminId: currentUser.id,
        status: 'REQUIRE_CHANGES',
        comments: reviewComments,
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.ownerId,
        type: 'PROJECT_APPROVAL',
        title: '📝 Changes Required for Your Project',
        message: `Your project "${project.name}" requires some changes before approval. Please review the feedback.`,
        link: `/projects/${id}/edit`,
      },
    })

    return successResponse(
      {
        project: updatedProject,
        approval,
      },
      'Changes requested successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Request changes error:', error)
    return errorResponse('Failed to request changes', 500)
  }
}
