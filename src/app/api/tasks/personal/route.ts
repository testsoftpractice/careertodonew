import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/tasks/personal
 * Get all personal tasks for a user
 * No authentication required for demo purposes
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const tasks = await db.personalTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching personal tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks/personal
 * Create a new personal task
 * No authentication required for demo purposes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, priority, dueDate } = body

    // Validation
    if (!userId || !title) {
      return NextResponse.json(
        { error: 'userId and title are required' },
        { status: 400 }
      )
    }

    if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be LOW, MEDIUM, HIGH, or CRITICAL' },
        { status: 400 }
      )
    }

    const task = await db.personalTask.create({
      data: {
        userId,
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'TODO',
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating personal task:', error)
    return NextResponse.json(
      { error: 'Failed to create personal task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/personal?id={taskId}
 * Delete a personal task
 * No authentication required for demo purposes
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      )
    }

    // Check if task belongs to user
    const task = await db.personalTask.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own tasks' },
        { status: 403 }
      )
    }

    await db.personalTask.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting personal task:', error)
    return NextResponse.json(
      { error: 'Failed to delete personal task' },
      { status: 500 }
    )
  }
}
