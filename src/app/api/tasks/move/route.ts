import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/tasks/move
 * Move a task to the next step in the workflow
 * Only OWNER and PROJECT_MANAGER can move tasks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, newStepId, projectId, userId } = body

    if (!taskId || !newStepId || !projectId || !userId) {
      return NextResponse.json(
        { error: 'taskId, newStepId, projectId, and userId are required' },
        { status: 400 }
      )
    }

    // Validate step ID
    const validSteps = ['1', '2', '3', '4']
    if (!validSteps.includes(newStepId)) {
      return NextResponse.json(
        { error: 'Invalid step ID. Must be 1, 2, 3, or 4' },
        { status: 400 }
      )
    }

    // Check if task exists
    const task = await db.task.findUnique({
      where: { id: taskId },
    })
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (task.projectId !== projectId) {
      return NextResponse.json(
        { error: 'Task does not belong to this project' },
        { status: 403 }
      )
    }

    // Check user's access level
    const member = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })
    if (!member) {
      return NextResponse.json(
        { error: 'User is not a member of this project' },
        { status: 403 }
      )
    }

    // Only OWNER and PROJECT_MANAGER can move tasks
    if (
      member.accessLevel !== 'OWNER' &&
      member.accessLevel !== 'PROJECT_MANAGER'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Only OWNER and PROJECT_MANAGER can move tasks' },
        { status: 403 }
      )
    }

    // Map step ID to status
    const stepStatusMap: Record<string, string> = {
      '1': 'TODO',
      '2': 'IN_PROGRESS',
      '3': 'REVIEW',
      '4': 'DONE',
    }

    const newStatus = stepStatusMap[newStepId]

    // Create TaskStep record to track the movement
    const stepName = {
      '1': 'To Do',
      '2': 'In Progress',
      '3': 'Review',
      '4': 'Done',
    }[newStepId]

    await db.taskStep.create({
      data: {
        taskId,
        stepNumber: newStepId,
        name: stepName,
        description: `Moved from step ${task.currentStepId} to step ${newStepId}`,
        movedBy: userId,
      },
    })

    // Update task status and currentStepId
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        status: newStatus as any,
        currentStepId: newStepId,
        completedAt: newStepId === '4' ? new Date() : null,
      },
    })

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error('Error moving task:', error)
    return NextResponse.json(
      { error: 'Failed to move task' },
      { status: 500 }
    )
  }
}
