import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus } from '@prisma/client'
import { requireAuth } from '@/lib/auth/verify'
import { forbidden, notFound, unauthorized } from '@/lib/api-response'

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
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
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
      assigneeId,
      status,
      priority,
      dueDate,
      estimatedHours,
      actualHours,
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
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
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

    const isOwner = existingTask.assignedBy === currentUser.id || existingTask.project!.ownerId === currentUser.id
    const isProjectMember = !!projectMember
    const isAssignee = existingTask.assignedTo === currentUser.id

    // Allow owner, project member, or task assignee to update
    if (!isOwner && !isProjectMember && !isAssignee) {
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
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    })
  } catch (error) {
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
      include: { project: true },
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Check permission
    const isOwner = existingTask.assignedBy === currentUser.id || existingTask.project!.ownerId === currentUser.id
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: existingTask.projectId!,
        userId: currentUser.id,
      },
    })

    if (!isOwner && !projectMember) {
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
