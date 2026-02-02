import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, badRequest, unauthorized, forbidden, notFound, validationError } from '@/lib/api-response'
import { validateRequest, createTaskSchema, updateTaskSchema } from '@/lib/validation'
import { verifyAuth, requireAuth } from '@/lib/auth/verify'

// ==================== TASKS API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.projectId as string | undefined
    const assigneeId = searchParams.assigneeId as string | undefined
    const status = searchParams.status as string | undefined
    const priority = searchParams.priority as string | undefined

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (assigneeId) {
      where.assignedTo = assigneeId  // Fix: use correct field name from Prisma schema
    }

    if (status) {
      where.status = status as any
    }

    if (priority) {
      where.priority = priority as any
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        subTasks: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }]
    })

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length
    })
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(createTaskSchema, body)

    if (!validation.valid) {
      return validationError(validation.errors)
    }

    const data = validation.data

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

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assignedTo: data.assigneeId || undefined,
        assignedBy: authResult.dbUser.id,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : null,
      }
    })

    return successResponse(task, 'Task created successfully', { status: 201 })
  } catch (error: any) {
    console.error('Task creation error:', error)

    // Handle AuthError - return proper JSON response
    if (error.name === 'AuthError' || error.statusCode) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to create task', 500)
  }
}

// NOTE: PATCH endpoint moved to /api/tasks/[id]/route.ts for proper REST routing
