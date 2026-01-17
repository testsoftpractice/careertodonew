import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus } from '@prisma/client'

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await db.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            projectLead: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        department: true,
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
            avatar: true,
          },
        },
        subtasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      assigneeId,
      status,
      priority,
      dueDate,
      deliverable,
      outputUrl,
      qualityScore,
      feedback,
    } = body

    const task = await db.task.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(status && { status: status as TaskStatus }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(deliverable !== undefined && { deliverable }),
        ...(outputUrl !== undefined && { outputUrl }),
        ...(qualityScore !== undefined && { qualityScore: parseFloat(qualityScore) }),
        ...(feedback !== undefined && { feedback }),
        ...(status === TaskStatus.COMPLETED && !body.completedAt && { completedAt: new Date() }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create notification for task completion
    if (status === TaskStatus.COMPLETED && task.assigneeId) {
      await db.notification.create({
        data: {
          userId: task.creatorId,
          type: 'TASK_DUE_REMINDER',
          title: 'Task Completed',
          message: `Task "${task.title}" has been completed by ${task.assignee.name}`,
          link: `/projects/${task.projectId}/tasks/${task.id}`,
        },
      })
    }

    return NextResponse.json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
