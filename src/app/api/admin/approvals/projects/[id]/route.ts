import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, getUserFromRequest } from '@/lib/api/auth-middleware'
import { ProjectApprovalStatus } from '@prisma/client'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// GET /api/admin/approvals/projects/[id] - Get project details for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    if (!user || user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can access this endpoint')
    }

    const { id } = await params

    // Get project with full details
    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: {
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
            university: {
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
        university: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                major: true,
              },
            },
          },
        },
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        milestones: {
          take: 10,
          orderBy: { dueDate: 'asc' },
        },
        investments: {
          include: {
            user: {
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
        approvals: {
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            milestones: true,
            investments: true,
          },
        },
      },
    })

    if (!project) {
      return notFound('Project not found')
    }

    return successResponse(project)
  } catch (error: any) {
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
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    if (!user || user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can reject projects')
    }

    const { id } = await params
    const body = await request.json()
    const { rejectionReason, reviewComments } = body

    if (!rejectionReason) {
      return errorResponse('Rejection reason is required', 400)
    }

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: true,
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
        adminId: user.id,
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
    const auth = requireAuth(request)
    if ('status' in auth) return auth

    const user = getUserFromRequest(request)
    if (!user || user.role !== 'PLATFORM_ADMIN') {
      return forbidden('Only platform admins can request changes')
    }

    const { id } = await params
    const body = await request.json()
    const { reviewComments } = body

    if (!reviewComments) {
      return errorResponse('Review comments are required', 400)
    }

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: true,
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
        adminId: user.id,
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
    console.error('Request changes error:', error)
    return errorResponse('Failed to request changes', 500)
  }
}
