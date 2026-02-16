import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus, TaskPriority } from '@/lib/constants'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse, forbidden, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

// Validation schema for project-specific tasks
const projectTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'description must be less than 1000 characters').optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().optional().refine((val) => {
    if (!val) return true
    // Try to parse the date - allow various formats
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, { message: 'Invalid due date format' }),
  estimatedHours: z.union([z.number().min(0).max(1000), z.string().transform(val => parseFloat(val))]).optional(),
  assigneeId: z.string().cuid('Invalid assignee ID').optional().or(z.literal('')),
  tags: z.array(z.string()).max(10).optional(),
})

// GET /api/projects/[id]/tasks - Get project-specific tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)

    const { id } = await params
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    // Build where clause for project tasks
    const where: Record<string, any> = {
      projectId: id,
    }

    // Add optional filters
    if (status) {
      where.status = status as any
    }

    if (priority) {
      where.priority = priority as any
    }

    // Fetch tasks for this project only
    const tasks = await db.task.findMany({
      where,
      include: {
        User_Task_assignedByToUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        Project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        SubTask: {
          orderBy: { sortOrder: 'asc' }
        },
        TaskAssignee: {
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
          orderBy: { assignedAt: 'asc' },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return successResponse(tasks, `Found ${tasks.length} project tasks`)
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get project tasks error:', error)

    // Handle AuthError
    if (error.name === 'AuthError') {
      return errorResponse(error.message || 'Authentication required', 401)
    }

    return errorResponse('Failed to fetch project tasks', 500)
  }
}

// POST /api/projects/[id]/tasks - Create project task
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)

    const { id } = await params
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Validate request body
    const validation = projectTaskSchema.safeParse(body)

    if (!validation.success) {
      // Defensive check for error object - ZodError has 'issues' property
      const errorObj = validation.error
      const errorMessage = errorObj?.issues?.[0]?.message || 'Invalid request body'
      return errorResponse(errorMessage, 400)
    }

    const data = validation.data

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: id },
      select: { ownerId: true }
    })
    if (!project) {
      return notFound('Project not found')
    }

    // Check if user is owner or member
    const isOwner = project.ownerId === currentUser.id

    const memberCount = await db.projectMember.count({
      where: {
        projectId: id,
        userId: currentUser.id,
      },
    })

    const isMember = memberCount > 0

    if (!isOwner && !isMember) {
      return forbidden('You are not a member of this project')
    }

    // Create task
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || 'TODO',
        priority: data.priority,
        projectId: id,
        assignedBy: currentUser.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseFloat(String(data.estimatedHours)) : null,
        currentStepId: '1',
      },
      include: {
        User_Task_assignedByToUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        Project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        SubTask: {
          orderBy: { sortOrder: 'asc' }
        },
        TaskAssignee: {
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
        },
      },
    })

    // Handle task assignee if provided
    if (data.assigneeId && typeof data.assigneeId === 'string' && data.assigneeId !== '') {
      // Create single assignee
      await db.taskAssignee.create({
        data: {
          taskId: task.id,
          userId: data.assigneeId,
          assignedAt: new Date(),
          sortOrder: 0,
        },
      })
    }

    return successResponse(task, 'Task created successfully')
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Create project task error:', error)

    // Handle AuthError - return proper JSON response
    if (error.name === 'AuthError') {
      return errorResponse(error.message || 'Authentication required', 401)
    }

    return errorResponse('Failed to create task', 500)
  }
}
