import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

// Validation schema for creating a subtask
const createSubtaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  sortOrder: z.number().int().min(0).optional(),
})

// GET /api/tasks/[id]/subtasks - Get all subtasks for a task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId } = await params

    // Check if task exists and user has access
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: { id: true, ownerId: true },
        },
      },
    })

    if (!task) {
      return notFound('Task not found')
    }

    // Check access permission
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
      return unauthorized('You do not have access to this task')
    }

    // Get all subtasks
    const subtasks = await db.subTask.findMany({
      where: { taskId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: subtasks,
      count: subtasks.length,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get subtasks error:', error)
    return errorResponse('Failed to fetch subtasks', 500)
  }
}

// POST /api/tasks/[id]/subtasks - Create a new subtask
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { id: taskId } = await params
    const body = await request.json()

    // Validate request body
    const validation = createSubtaskSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.issues[0]?.message || 'Invalid input', 400)
    }

    const data = validation.data

    // Check if task exists and user has access
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: { id: true, ownerId: true },
        },
      },
    })

    if (!task) {
      return notFound('Task not found')
    }

    // Check if user can add subtasks (task creator, project owner, or project member)
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
      return unauthorized('You do not have permission to add subtasks to this task')
    }

    // Get the next sort order if not provided
    let sortOrder = data.sortOrder
    if (sortOrder === undefined) {
      const lastSubtask = await db.subTask.findFirst({
        where: { taskId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      })
      sortOrder = (lastSubtask?.sortOrder ?? -1) + 1
    }

    // Create subtask
    const subtask = await db.subTask.create({
      data: {
        taskId,
        title: data.title,
        sortOrder,
        completed: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: subtask,
      message: 'Subtask created successfully',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Create subtask error:', error)
    return errorResponse('Failed to create subtask', 500)
  }
}
