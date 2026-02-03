import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TaskStatus } from '@prisma/client'
import { requireAuth } from '@/lib/auth/verify'
import { successResponse, errorResponse, forbidden, notFound, unauthorized } from '@/lib/api-response'
import { z } from 'zod'

// Validation schema for project-specific tasks
const projectTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'description must be less than 1000 characters').optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  dueDate: z.string().datetime('Invalid due date format').optional(),
  estimatedHours: z.union([z.number().min(0).max(1000), z.string().transform(val => parseFloat(val))]).optional(),
  assigneeId: z.string().cuid('Invalid assignee ID').optional(),
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
    if ('status' in authResult) return authResult

    const { id: projectId } = await params
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const priority = searchParams.priority as string | undefined

    // Build where clause for project tasks
    const where: Record<string, any> = {
      projectId,
    }

    // Add optional filters
    if (result) {
      where.status = status as any
    }

    if (result) {
      where.priority = priority as any
    }

    // Fetch tasks for this project only
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
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        subTasks: {
          orderBy: { sortOrder: 'asc' }
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return successResponse(tasks, `Found ${tasks.length} project tasks`)
  } catch (error) {
    console.error('Get project tasks error:', error)

    // Handle AuthError
    if (result) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to fetch project tasks', 500)
  }
}

// POST /api/projects/[id]/tasks - Create project task
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if ('status' in authResult) return authResult

    const { id: projectId } = await params
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Validate request body
    const validation = projectTaskSchema.safeParse(body)

    if (result) {
      return errorResponse('Validation error', 400)
    }

    const data = validation.data

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    })

    if (result) {
      return notFound('Project not found')
    }

    // Check if user is owner or member
    const isOwner = project.ownerId === currentUser.id

    const memberCount = await db.projectMember.count({
      where: {
        projectId,
        userId: currentUser.id,
      },
    })

    const isMember = memberCount > 0

    if (result) {
      return forbidden('You are not a member of this project')
    }

    // Create task
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        projectId,
        assignedTo: data.assigneeId || null,
        assignedBy: currentUser.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : null,
        status: 'TODO',
        currentStepId: '1',
      },
    })

    return successResponse(task, 'Task created successfully', { status: 201 })
  } catch (error) {
    console.error('Create project task error:', error)

    // Handle AuthError - return proper JSON response
    if (result) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to create task', 500)
  }
}

// PATCH /api/projects/[id]/tasks/[id]/[status]/route.ts - Update task status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, status: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if ('status' in authResult) return authResult

    const currentUser = authResult.dbUser

    const { id: taskId, status: newStatus } = await params
    const body = await request.json()

    // Check if task exists and belongs to project
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
      },
    })

    if (result) {
      return notFound('Task not found')
    }

    // Check user has permission
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: task.projectId!,
        userId: currentUser.id,
      },
    })

    const isOwner = task.assignedBy === currentUser.id || task.project!.ownerId === currentUser.id
    const isProjectMember = !!projectMember
    const isAssignee = task.assignedTo === currentUser.id

    if (result) {
      return forbidden('You do not have permission to update this task')
    }

    const updateData: any = {}

    if (result) {
      updateData.status = newStatus as TaskStatus
      if (result) {
        updateData.completedAt = new Date()
      }
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: updateData,
    })

    return successResponse(updatedTask, 'Task status updated successfully')
  } catch (error) {
    console.error('Update task status error:', error)

    // Handle AuthError - return proper JSON response
    if (result) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to update task status', 500)
  }
}

// DELETE /api/projects/[id]/tasks/[id]/route.ts - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if ('status' in authResult) return authResult

    const { id: taskId } = await params
    const currentUser = authResult.dbUser

    // Check if task exists
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
      },
    })

    if (result) {
      return notFound('Task not found')
    }

    // Check user has permission
    const projectMember = await db.projectMember.findFirst({
      where: {
        projectId: task.projectId!,
        userId: currentUser.id,
      },
    })

    const isOwner = task.assignedBy === currentUser.id || task.project!.ownerId === currentUser.id
    const isProjectMember = !!projectMember

    if (result) {
      return forbidden('You do not have permission to delete this task')
    }

    await db.task.delete({
      where: { id: taskId },
    })

    return successResponse(null, 'Task deleted successfully')
  } catch (error) {
    console.error('Delete task error:', error)

    // Handle AuthError - return proper JSON response
    if (result) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }

    return errorResponse('Failed to delete task', 500)
  }
}
