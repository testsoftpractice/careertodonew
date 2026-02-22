import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse, notFound, unauthorized } from '@/lib/api-response'

// GET /api/tasks/[id]/assignees - Get all assignees for a task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId } = await params

    // Check if task exists and user has access
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        Project: {
          select: { id: true, ownerId: true },
        },
      },
    })

    if (!task) {
      return notFound('Task not found')
    }

    // Check access permission
    const isCreator = task.assignedBy === currentUser.id
    const isProjectOwner = task.Project?.ownerId === currentUser.id

    let hasAccess = isCreator || isProjectOwner

    if (!hasAccess && task.projectId) {
      const member = await db.projectMember.findFirst({
        where: {
          projectId: task.projectId,
          userId: currentUser.id,
        },
      })
      hasAccess = !!member
    }

    if (!hasAccess) {
      return unauthorized('You do not have access to this task')
    }

    // Get all assignees
    const assignees = await db.taskAssignee.findMany({
      where: { taskId },
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
      orderBy: { assignedAt: 'asc' },
    })

    return successResponse({ assignees }, `Found ${assignees.length} assignees`)
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get assignees error:', error)
    return errorResponse('Failed to fetch assignees', 500)
  }
}
