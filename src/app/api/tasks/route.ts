import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, badRequest, unauthorized, forbidden, notFound, validationError } from '@/lib/api-response'
import { validateRequest, createTaskSchema, updateTaskSchema } from '@/lib/validation'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'

// ==================== TASKS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId') as string | undefined
    const assigneeId = searchParams.get('assigneeId') as string | undefined
    const status = searchParams.get('status') as string | undefined
    const priority = searchParams.get('priority') as string | undefined
    const includeSubtasks = searchParams.get('includeSubtasks') === 'true'
    const includeComments = searchParams.get('includeComments') === 'true'
    const includeAssignees = searchParams.get('includeAssignees') === 'true'
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (assigneeId) {
      where.TaskAssignee = {
        some: {
          userId: assigneeId
        }
      }
    }

    if (status) {
      where.status = status as any
    }

    if (priority) {
      where.priority = priority as any
    }

    // Build optimized include - only include what's requested
    const include: Record<string, any> = {
      User_Task_assignedByToUser: {
        select: {
          id: true,
          name: true,
        },
      },
      Project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    }

    if (includeSubtasks) {
      include.SubTask = {
        select: {
          id: true,
          taskId: true,
          title: true,
          completed: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: 'asc' },
      }
    }

    if (includeComments) {
      include.TaskComment = {
        include: {
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Limit comments per task to prevent performance issues
      }
    }

    if (includeAssignees) {
      include.TaskAssignee = {
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }
    }

    const tasks = await db.task.findMany({
      where,
      include,
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      take: limit, // Add pagination support
    })

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Tasks API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    const body = await request.json()

    // Validate request body (accepts both old and new format)
    const validation = validateRequest(createTaskSchema, body)

    if (!validation.success) {
      console.log('[TASKS] Validation error:', validation.error)
      return validationError(validation.details || [{ field: 'general', message: validation.error }])
    }

    const data = validation.data!

    // Check if projectId is provided
    if (!data.projectId) {
      return badRequest('projectId is required to create a task')
    }

    // Check if user is project owner or member
    const project = await db.project.findUnique({
      where: { id: data.projectId },
      select: { ownerId: true, id: true }
    })

    if (!project) {
      return notFound('Project not found')
    }

    const isOwner = project.ownerId === authResult.dbUser.id

    // Check if user is member of the project
    const memberCount = await db.projectMember.count({
      where: {
        projectId: data.projectId,
        userId: authResult.dbUser.id,
      },
    })

    const isMember = memberCount > 0

    // Allow if owner or member
    if (!isOwner && !isMember) {
      return forbidden('You are not a member of this project')
    }

    // Handle assignees - support both old single assigneeId and new assigneeIds array
    const assigneeIds = body.assigneeIds || []

    // Create task without primary assignee field
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assignedBy: authResult.dbUser.id,
        status: data.status || 'TODO',
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours.toString()) : null,
      }
    })

    // Create TaskAssignee entries for all assignees
    if (assigneeIds.length > 0) {
      const assigneesToCreate = assigneeIds.map((userId, index) => ({
        taskId: task.id,
        userId,
        assignedAt: new Date(),
        sortOrder: index, // Preserve order from the array
      }))

      await db.taskAssignee.createMany({
        data: assigneesToCreate,
      })
    }

    // Create SubTasks if provided
    if (body.subtasks && Array.isArray(body.subtasks) && body.subtasks.length > 0) {
      const subtasksToCreate = body.subtasks
        .map((subtask: any, index: number) => ({
          taskId: task.id,
          title: subtask.title,
          sortOrder: index,
          completed: false,
        }))

      await db.subTask.createMany({
        data: subtasksToCreate,
      })
    }

    return successResponse(task, 'Task created successfully', undefined, 201)
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Task creation error:', error)

    // Handle AuthError - return proper JSON response
    if (error.name === 'AuthError') {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to create task', 500)
  }
}

// NOTE: PATCH endpoint moved to /api/tasks/[id]/route.ts for proper REST routing
