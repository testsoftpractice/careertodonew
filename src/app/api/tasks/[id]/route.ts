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

    // Fetch the task before updating to check if it's being completed
    const existingTask = await db.task.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        status: true,
        assigneeId: true,
        creatorId: true,
        projectId: true,
        title: true,
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const isCompleting = status === TaskStatus.COMPLETED && existingTask.status !== TaskStatus.COMPLETED

    // Update task in a transaction to also award points
    const updatedTask = await db.$transaction(async (tx) => {
      const task = await tx.task.update({
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

      // Award points for task completion
      if (isCompleting && existingTask.assigneeId) {
        try {
          await tx.pointTransaction.create({
            data: {
              userId: existingTask.assigneeId,
              points: 10, // TASK_COMPLETION points
              source: 'TASK_COMPLETION',
              description: `Completed task: ${task.title}`,
              metadata: JSON.stringify({
                taskId: task.id,
                taskTitle: task.title,
                projectId: task.projectId,
                projectTitle: task.project.title,
              }),
            }
          })

          // Update user's total points
          await tx.user.update({
            where: { id: existingTask.assigneeId },
            data: {
              totalPoints: {
                increment: 10,
              },
            },
          })
        } catch (pointsError) {
          console.error('Failed to award points for task completion:', pointsError)
          // Continue even if points awarding fails
        }
      }

      return task
    })

    // Create notification for task completion
    if (status === TaskStatus.COMPLETED && existingTask.assigneeId) {
      await db.notification.create({
        data: {
          userId: existingTask.creatorId,
          type: 'TASK_DUE_REMINDER',
          title: 'Task Completed',
          message: `Task "${existingTask.title}" has been completed by ${updatedTask.assignee?.name}`,
          link: `/projects/${existingTask.projectId}/tasks/${existingTask.id}`,
        },
      })
    }

    return NextResponse.json({
      message: 'Task updated successfully',
      task: updatedTask,
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
