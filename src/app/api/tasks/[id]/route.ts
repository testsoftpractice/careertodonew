import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus } from '@prisma/client'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { forbidden, notFound, unauthorized, errorResponse } from '@/lib/api-response'

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        subTasks: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        taskAssignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                email: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!task) {
      return notFound('Task not found')
    }

    return NextResponse.json({
      success: true,
      data: task
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)

    const currentUser = authResult.dbUser

    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      assigneeIds,
      status,
      priority,
      dueDate,
      estimatedHours,
      actualHours,
      subtasks,
    } = body

    // Check if task exists
    const existingTask = await db.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            ownerId: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        taskAssignees: true,
        subTasks: {
          orderBy: { sortOrder: 'asc' }
        },
      },
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Check if user has permission to update this task
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: existingTask.projectId!,
        userId: currentUser.id,
      },
    })

    const isTaskAssignee = existingTask.taskAssignees.some(ta => ta.userId === currentUser.id)
    const isOwner = existingTask.assignedBy === currentUser.id || existingTask.project!.ownerId === currentUser.id
    const isProjectMember = !!projectMember

    // Allow owner, project member, or task assignee to update
    if (!isOwner && !isProjectMember && !isTaskAssignee) {
      return forbidden('You do not have permission to update this task')
    }

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) {
      updateData.status = status as TaskStatus
      if (status === 'DONE') {
        updateData.completedAt = new Date()
      }
    }
    if (priority !== undefined) updateData.priority = priority
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null
    if (actualHours !== undefined) updateData.actualHours = actualHours ? parseFloat(actualHours) : null

    // Handle assignees - use only TaskAssignee junction table
    if (assigneeIds !== undefined && Array.isArray(assigneeIds)) {
      const newAssigneeIds = assigneeIds.filter(id => id && id !== '') // Remove empty/null strings
      
      // Get current assignees
      const currentAssigneeIds = existingTask.taskAssignees.map(ta => ta.userId)
      
      const assigneesToRemove = currentAssigneeIds.filter(id => !newAssigneeIds.includes(id))
      const assigneesToAdd = newAssigneeIds.filter(id => !currentAssigneeIds.includes(id))

      // Remove old assignees
      if (assigneesToRemove.length > 0) {
        await db.taskAssignee.deleteMany({
          where: {
            taskId: id,
            userId: { in: assigneesToRemove },
          },
        })
      }

      // Add new assignees
      if (assigneesToAdd.length > 0) {
        await db.taskAssignee.createMany({
          data: assigneesToAdd.map((userId, index) => ({
            taskId: id,
            userId,
            assignedAt: new Date(),
            sortOrder: index,
          })),
        })
      }
    }

    // Handle subtasks if provided
    if (subtasks !== undefined && Array.isArray(subtasks)) {
      const currentSubtaskIds = existingTask.subTasks.map(st => st.id)
      
      // Identify subtasks to keep (those present in the new array with valid IDs)
      const subtaskIdsToKeep = subtasks
        .filter(st => st.id && currentSubtaskIds.includes(st.id))
        .map(st => st.id)
      
      // Subtasks to remove (existing but not in the keep list)
      const subtasksToRemove = currentSubtaskIds.filter(id => !subtaskIdsToKeep.includes(id))
      
      // Subtasks to add (new subtasks without IDs, or subtasks with IDs not in current list)
      const subtasksToAdd = subtasks.filter(st => 
        !currentSubtaskIds.includes(st.id)
      )

      // Remove old subtasks that weren't sent in the update
      if (subtasksToRemove.length > 0) {
        await db.subTask.deleteMany({
          where: {
            taskId: id,
            id: { in: subtasksToRemove },
          },
        })
      }

      // Add new subtasks (those without IDs or new IDs)
      if (subtasksToAdd.length > 0) {
        await db.subTask.createMany({
          data: subtasksToAdd.map((st, index) => ({
            taskId: id,
            title: st.title || st.name || 'Untitled Subtask',
            completed: st.completed || false,
            sortOrder: st.sortOrder !== undefined ? st.sortOrder : index,
          })),
        })
      }
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        taskAssignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        subTasks: {
          orderBy: { sortOrder: 'asc' }
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Update task error:', error)

    // Handle AuthError - return proper JSON response
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message || 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)

    const currentUser = authResult.dbUser

    const { id } = await params

    // Check if task exists and user has permission
    const existingTask = await db.task.findUnique({
      where: { id },
      include: { 
        project: true,
        taskAssignees: true,
      },
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Check permission
    const isCreator = existingTask.assignedBy === currentUser.id
    const isProjectOwner = existingTask.project!.ownerId === currentUser.id
    const isTaskAssignee = existingTask.taskAssignees.some(ta => ta.userId === currentUser.id)
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: existingTask.projectId!,
        userId: currentUser.id,
      },
    })

    // Allow creator, project owner, project member, or task assignee to delete
    if (!isCreator && !isProjectOwner && !projectMember && !isTaskAssignee) {
      return forbidden('You do not have permission to delete this task')
    }

    await db.task.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Delete task error:', error)

    // Handle AuthError - return proper JSON response
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message || 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
