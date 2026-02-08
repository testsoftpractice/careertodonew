import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

// Validation schema for adding assignees
const addAssigneeSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
})

// GET /api/tasks/[id]/assignees - Get all assignees for a task
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
      return unauthorized('You do not have access to this task')
    }

    // Get all task assignees
    const assignees = await db.taskAssignee.findMany({
      where: { taskId },
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
      orderBy: { assignedAt: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: assignees,
      count: assignees.length,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get task assignees error:', error)
    return errorResponse('Failed to fetch task assignees', 500)
  }
}

// POST /api/tasks/[id]/assignees - Add a new assignee to a task
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
    const validation = addAssigneeSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0]?.message || 'Invalid input', 400)
    }

    const { userId } = validation.data

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

    // Check if user can add assignees (task creator, project owner, or project member)
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
      return unauthorized('You do not have permission to add assignees to this task')
    }

    // Check if user is already an assignee
    const existingAssignee = await db.taskAssignee.findFirst({
      where: {
        taskId,
        userId,
      },
    })

    if (existingAssignee) {
      return errorResponse('User is already assigned to this task', 400)
    }

    // Add assignee
    const assignee = await db.taskAssignee.create({
      data: {
        taskId,
        userId,
      },
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
    })

    // If task has no primary assignee, set this one
    if (!task.assignedTo) {
      await db.task.update({
        where: { id: taskId },
        data: { assignedTo: userId },
      })
    }

    // Create notification for the assignee
    await db.notification.create({
      data: {
        userId,
        type: 'TASK_ASSIGNED',
        title: '📋 Task Assigned',
        message: `You have been assigned to task: "${task.title}"`,
        link: `/projects/${task.projectId}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: assignee,
      message: 'Assignee added successfully',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Add task assignee error:', error)
    return errorResponse('Failed to add assignee', 500)
  }
}
