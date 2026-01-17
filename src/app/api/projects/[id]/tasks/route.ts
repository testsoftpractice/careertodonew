import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { AdvancedTask, TaskPriority, TaskStatus, isTaskComplete, getTaskEstimations, TaskConflict, detectTaskConflicts } from '@/lib/models/advanced-task'
import { canPerformAction } from '@/lib/models/project-roles'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(1000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW']).default('TODO'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(1).max(1000).optional(),
  projectId: z.string(),
  dependsOn: z.array(z.string()).default([]),
})

const updateTaskSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(1000).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']).optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(1).max(1000).optional(),
  actualHours: z.number().min(0).max(1000).optional(),
  completedAt: z.string().datetime().optional(),
  dependsOn: z.array(z.string()).optional(),
})

// POST /api/projects/[id]/tasks - Create task (enhanced)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    // Check if user has permission to create task
    const project = await db.project.findUnique({
      where: { id },
      select: { id: true, projectLeadId: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!canPerformAction({ user, action: 'create' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to create task' }, { status: 403 })
    }

    // Create advanced task
    const task = await db.task.create({
      data: {
        projectId: id,
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        assignedTo: validatedData.assignedTo,
        assignedBy: user.id,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        estimatedHours: validatedData.estimatedHours,
        dependsOn: validatedData.dependsOn,
        tags: [],
        checklist: [],
        createdAt: new Date(),
      },
    })

    // Detect conflicts
    const conflicts = detectTaskConflicts([task])

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          dependsOn: task.dependsOn,
          conflicts,
        },
        estimations: getTaskEstimations(task),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/projects/[id]/tasks/[taskId] - Update task (enhanced)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, taskId } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    // Get task
    const task = await db.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has permission to update this task
    if (!canPerformAction({ user, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to update task' }, { status: 403 })
    }

    // Update task
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
        completedAt: validatedData.status === 'DONE' ? new Date() : task.completedAt,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          priority: updatedTask.priority,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/tasks/[taskId] - Delete task (enhanced)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { taskId } = await params
  const user = auth.user

  try {
    // Get task
    const task = await db.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has permission to delete this task
    if (!canPerformAction({ user, action: 'delete' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to delete task' }, { status: 403 })
    }

    // Delete task
    await db.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Task deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
