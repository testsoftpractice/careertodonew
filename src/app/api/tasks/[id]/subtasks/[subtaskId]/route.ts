import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

// Validation schema for updating a subtask
const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

// PATCH /api/tasks/[id]/subtasks/[subtaskId] - Update a subtask
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId, subtaskId } = await params
    const body = await request.json()

    // Validate request body
    const validation = updateSubtaskSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0]?.message || 'Invalid input', 400)
    }

    const data = validation.data

    // Check if subtask exists
    const subtask = await db.subTask.findUnique({
      where: { id: subtaskId },
      include: {
        task: {
          include: {
            project: {
              select: { id: true, ownerId: true },
            },
          },
        },
      },
    })

    if (!subtask || subtask.taskId !== taskId) {
      return notFound('Subtask not found')
    }

    // Check access permission
    const task = subtask.task
    const isCreator = task.assignedBy === currentUser.id
    const isAssignee = task.assignedTo === currentUser.id
    const isProjectOwner = task.project?.ownerId === currentUser.id

    let hasAccess = isCreator || isAssignee || isProjectOwner

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
      return unauthorized('You do not have permission to update this subtask')
    }

    // Update subtask
    const updatedSubtask = await db.subTask.update({
      where: { id: subtaskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedSubtask,
      message: 'Subtask updated successfully',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Update subtask error:', error)
    return errorResponse('Failed to update subtask', 500)
  }
}

// DELETE /api/tasks/[id]/subtasks/[subtaskId] - Delete a subtask
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId, subtaskId } = await params

    // Check if subtask exists
    const subtask = await db.subTask.findUnique({
      where: { id: subtaskId },
      include: {
        task: {
          include: {
            project: {
              select: { id: true, ownerId: true },
            },
          },
        },
      },
    })

    if (!subtask || subtask.taskId !== taskId) {
      return notFound('Subtask not found')
    }

    // Check access permission
    const task = subtask.task
    const isCreator = task.assignedBy === currentUser.id
    const isProjectOwner = task.project?.ownerId === currentUser.id

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
      return unauthorized('You do not have permission to delete this subtask')
    }

    // Delete subtask
    await db.subTask.delete({
      where: { id: subtaskId },
    })

    return NextResponse.json({
      success: true,
      message: 'Subtask deleted successfully',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Delete subtask error:', error)
    return errorResponse('Failed to delete subtask', 500)
  }
}
