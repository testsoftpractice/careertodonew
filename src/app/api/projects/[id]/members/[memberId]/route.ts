import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { db } from '@/lib/db'
import { isFeatureEnabled, PROJECT_ROLES } from '@/lib/features/flags'
import { errorResponse, forbidden, notFound, successResponse, validationError } from '@/lib/api-response'

// Validation schema for updating member role
const updateMemberSchema = z.object({
  role: z.enum(['OWNER', 'PROJECT_MANAGER', 'TEAM_LEAD', 'TEAM_MEMBER', 'VIEWER']).optional(),
})

/**
 * GET /api/projects/[id]/members/[memberId]
 * Get a specific project member
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return errorResponse('Feature not enabled', 503)
  }

  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id: projectId, memberId } = await params

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true },
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user has access to project
    const isOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'UNIVERSITY_ADMIN'

    if (!isOwner && !isAdmin) {
      return forbidden('No access to this project')
    }

    // Get the specific member
    const member = await db.projectMember.findUnique({
      where: {
        id: memberId,
        projectId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    if (!member) {
      return notFound('Member not found')
    }

    return successResponse(member)
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get project member error:', error)
    return errorResponse('Failed to fetch project member', 500)
  }
}

/**
 * PATCH /api/projects/[id]/members/[memberId]
 * Update a project member's role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return errorResponse('Feature not enabled', 503)
  }

  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id: projectId, memberId } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateMemberSchema.safeParse(body)
    if (!validation.success) {
      return validationError(validation.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })))
    }

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true, name: true },
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user has permission (project owner or admin)
    const isProjectOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'UNIVERSITY_ADMIN'

    if (!isProjectOwner && !isAdmin) {
      return forbidden('Only project owner or admins can update member roles')
    }

    // Get the member to update
    const member = await db.projectMember.findUnique({
      where: { id: memberId, projectId },
    })
    if (!member) {
      return notFound('Member not found')
    }

    // Prevent changing the project owner's role
    if (member.userId === project.ownerId) {
      return forbidden('Cannot change the project owner\'s role')
    }

    // Update the member's role
    const updatedMember = await db.projectMember.update({
      where: { id: memberId },
      data: {
        role: validation.data.role,
        accessLevel: validation.data.role === 'OWNER' ? 'OWNER' : 'VIEW',
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    // Create notification for the updated member
    await db.notification.create({
      data: {
        userId: member.userId,
        type: 'PROJECT_UPDATE',
        title: 'Role Updated',
        message: `Your role in project "${project.name}" has been updated to ${validation.data.role}`,
        link: `/projects/${projectId}`,
      },
    })

    return successResponse(updatedMember, 'Member role updated successfully')
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Update project member error:', error)
    return errorResponse('Failed to update project member', 500)
  }
}

/**
 * DELETE /api/projects/[id]/members/[memberId]
 * Remove a member from a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  if (!isFeatureEnabled(PROJECT_ROLES)) {
    return errorResponse('Feature not enabled', 503)
  }

  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser
    const { id: projectId, memberId } = await params

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true, name: true },
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user has permission (project owner or admin)
    const isProjectOwner = project.ownerId === currentUser.id
    const isAdmin = currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'UNIVERSITY_ADMIN'

    if (!isProjectOwner && !isAdmin) {
      return forbidden('Only project owner or admins can remove members')
    }

    // Get the member to remove
    const member = await db.projectMember.findUnique({
      where: { id: memberId, projectId },
    })
    if (!member) {
      return notFound('Member not found')
    }

    // Prevent removing the project owner
    if (member.userId === project.ownerId) {
      return forbidden('Cannot remove the project owner from the project')
    }

    // Delete the member
    await db.projectMember.delete({
      where: { id: memberId },
    })

    // Create notification for the removed member
    await db.notification.create({
      data: {
        userId: member.userId,
        type: 'PROJECT_UPDATE',
        title: 'Removed from Project',
        message: `You have been removed from project "${project.name}"`,
        link: `/projects`,
      },
    })

    return successResponse({ id: memberId }, 'Member removed from project successfully')
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Delete project member error:', error)
    return errorResponse('Failed to remove project member', 500)
  }
}
