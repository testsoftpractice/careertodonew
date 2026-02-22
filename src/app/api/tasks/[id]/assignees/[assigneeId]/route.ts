import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, notFound, unauthorized } from '@/lib/api-response'

// DELETE /api/tasks/[id]/assignees/[assigneeId] - Remove an assignee from a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assigneeId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId, assigneeId } = await params

    // Check if assignee exists
    const assignee = await db.taskAssignee.findUnique({
      where: { id: assigneeId },
      include: {
        Task: {
          include: {
            Project: {
              select: { id: true, ownerId: true },
            },
          },
        },
      },
    })

    if (!assignee || assignee.taskId !== taskId) {
      return notFound('Assignee not found')
    }

    // Check access permission
    const task = assignee.Task
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
      return unauthorized('You do not have permission to remove assignees from this task')
    }

    // Delete assignee
    await db.taskAssignee.delete({
      where: { id: assigneeId },
    })

    return NextResponse.json({
      success: true,
      message: 'Assignee removed successfully',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Delete task assignee error:', error)
    return errorResponse('Failed to remove assignee', 500)
  }
}
