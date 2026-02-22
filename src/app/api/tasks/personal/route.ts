import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, validationError, unauthorized, badRequest, notFound } from '@/lib/api-response'
import { validateRequest } from '@/lib/validation'
import { verifyAuth } from '@/lib/auth/verify'
import { TaskPriority } from '@/lib/constants'
import { z } from 'zod'

/**
 * GET /api/tasks/personal
 * Get all personal tasks for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    if (!userId) {
      return badRequest('userId is required')
    }

    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized()
    }

    // Verify user is requesting their own tasks
    if (authResult.user.id !== userId) {
      return errorResponse('Forbidden', 403)
    }

    const tasks = await db.personalTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(tasks)
  } catch (error) {
    console.error('Error fetching personal tasks:', error)
    return errorResponse('Failed to fetch personal tasks')
  }
}

/**
 * POST /api/tasks/personal
 * Create a new personal task
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized()
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT]).default(TaskPriority.MEDIUM),
        dueDate: z.string().datetime().optional(),
      }),
      body
    )

    if (!validation.success) {
      console.log('[PERSONAL TASKS] Validation error:', validation.error)
      return validationError(validation.details || [{ field: 'general', message: validation.error }])
    }

    const data = validation.data!

    const task = await db.personalTask.create({
      data: {
        userId: authResult.user!.id,
        title: data.title,
        description: data.description || null,
        priority: (data.priority as any) || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: 'TODO',
      },
    })

    return successResponse(task, 'Task created successfully', undefined, 201)
  } catch (error) {
    console.error('Error creating personal task:', error)
    return errorResponse('Failed to create personal task')
  }
}

/**
 * PATCH /api/tasks/personal?id={taskId}
 * Update a personal task
 */
export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    if (!id || !userId) {
      return badRequest('id and userId are required')
    }

    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized()
    }

    // Verify user is updating their own task
    if (authResult.user.id !== userId) {
      return errorResponse('Forbidden', 403)
    }

    // Check if task belongs to user
    const task = await db.personalTask.findUnique({
      where: { id: id as string },
    })
    if (!task) {
      return errorResponse('Task not found', 404)
    }

    if (task.userId !== (userId as string)) {
      return errorResponse('Unauthorized', 403)
    }

    const body = await request.json()

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'DONE') updateData.completedAt = new Date()
    }

    const updatedTask = await db.personalTask.update({
      where: { id: id as string },
      data: updateData,
    })

    return successResponse(updatedTask, 'Task updated successfully')
  } catch (error) {
    console.error('Error updating personal task:', error)
    return errorResponse('Failed to update personal task')
  }
}

/**
 * DELETE /api/tasks/personal?id={taskId}
 * Delete a personal task
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    if (!id || !userId) {
      return badRequest('id and userId are required')
    }

    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized()
    }

    // Verify user is deleting their own task
    if (authResult.user.id !== userId) {
      return errorResponse('Forbidden: You can only delete your own tasks', 403)
    }

    // Check if task belongs to user
    const task = await db.personalTask.findUnique({
      where: { id: id as string },
    })
    if (!task) {
      return notFound('Task not found')
    }

    if (task.userId !== userId) {
      return errorResponse('Forbidden: You can only delete your own tasks', 403)
    }

    await db.personalTask.delete({
      where: { id: id as string },
    })

    return successResponse({ id }, 'Task deleted successfully')
  } catch (error) {
    console.error('Error deleting personal task:', error)
    return errorResponse('Failed to delete personal task')
  }
}
