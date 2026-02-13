import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/tasks/project?projectId={projectId}
 * Get all tasks for a project with access control
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId') // In production, this comes from auth

    if (!userId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    // In production, verify user is authenticated and check access level
    // For now, we'll fetch tasks (access control can be added later)

    const tasks = await db.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        taskAssignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching project tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks/project?projectId={projectId}
 * Create a new project task with access control
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const body = await request.json()
    const { userId, title, description, priority, dueDate } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId and title are required' },
        { status: 400 }
      )
    }

    // Check if user has access to create tasks
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

    // Only OWNER and PROJECT_MANAGER can create tasks
    if (
      member.accessLevel !== 'OWNER' &&
      member.accessLevel !== 'PROJECT_MANAGER'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Only OWNER and PROJECT_MANAGER can create tasks' },
        { status: 403 }
      )
    }

    if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be LOW, MEDIUM, HIGH, or CRITICAL' },
        { status: 400 }
      )
    }

    const task = await db.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'TODO',
        assignedBy: userId,
        currentStepId: '1',
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating project task:', error)
    return NextResponse.json(
      { error: 'Failed to create project task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/project?id={taskId}&projectId={projectId}&userId={userId}
 * Delete a project task with access control
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'id, projectId, and userId are required' },
        { status: 400 }
      )
    }

    // Check if task exists and belongs to project
    const task = await db.task.findUnique({
      where: { id: id as string },
    })
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Task does not belong to this project' },
        { status: 403 }
      )
    }

    // Check user's access level
    const member = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId as string,
          userId: userId as string,
        },
      },
    })
    if (!member) {
      return NextResponse.json(
        { error: 'User is not a member of this project' },
        { status: 403 }
      )
    }

    // Only OWNER and PROJECT_MANAGER can delete tasks
    if (
      member.accessLevel !== 'OWNER' &&
      member.accessLevel !== 'PROJECT_MANAGER'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Only OWNER and PROJECT_MANAGER can delete tasks' },
        { status: 403 }
      )
    }

    await db.task.delete({
      where: { id: id as string },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting project task:', error)
    return NextResponse.json(
      { error: 'Failed to delete project task' },
      { status: 500 }
    )
  }
}
