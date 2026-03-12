import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse, forbidden, notFound } from '@/lib/api-response'

// POST /api/projects/[id]/resubmit - Resubmit project for approval after making changes
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    if (!currentUser) {
      return forbidden('Authentication required')
    }

    const { id } = await params

    // Get project and verify ownership
    const project = await db.project.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        University: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!project) {
      return notFound('Project not found')
    }

    // ONLY the project owner can resubmit - no exceptions
    if (project.ownerId !== currentUser.id) {
      return forbidden('Only the project owner can resubmit the project')
    }

    // Check if project is in REQUIRE_CHANGES or REJECTED status
    if (project.approvalStatus !== 'REQUIRE_CHANGES' && project.approvalStatus !== 'REJECTED') {
      return errorResponse('This project does not require changes or is not rejected', 400)
    }

    // Update project approval status back to PENDING for re-review
    // DO NOT change the project status - owner cannot modify it
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        approvalStatus: 'PENDING',
        submissionDate: new Date(),
        // Keep the project status as is - do not reset to IDEA
        // project.status remains unchanged
        reviewComments: null, // Clear previous review comments
        terminationReason: null, // Clear previous rejection reason
      },
    })

    // Create approval record for resubmission - use SYSTEM or leave adminId null since owner is resubmitting
    await db.projectApproval.create({
      data: {
        projectId: id,
        adminId: currentUser.id, // Owner is the one creating this record
        status: 'RESUBMITTED',
        comments: 'Project resubmitted after changes by owner',
      },
    })

    // Notify admins about resubmission
    const admins = await db.user.findMany({
      where: {
        role: 'PLATFORM_ADMIN',
      },
      select: {
        id: true,
      },
    })

    // Create notifications for all admins
    if (admins.length > 0) {
      await db.notification.createMany({
        data: admins.map(admin => ({
          userId: admin.id,
          type: 'PROJECT_APPROVAL',
          title: '🔄 Project Resubmitted',
          message: `Project "${project.name}" has been resubmitted for approval after changes by the owner.`,
          link: `/admin/approvals/projects`,
          projectId: id,
        })),
      })
    }

    return successResponse(
      {
        project: updatedProject,
      },
      'Project resubmitted for approval successfully'
    )
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error('Authentication error:', error.message)
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Resubmit project error:', error)
    return errorResponse('Failed to resubmit project', 500)
  }
}
