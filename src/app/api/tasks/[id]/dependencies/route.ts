import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'
import { canPerformAction } from '@/lib/models/project-roles'

// Validation schemas
const addDependencySchema = z.object({
  dependsOnId: z.string(),
  dependencyType: z.enum(['MUST_COMPLETE', 'MUST_START', 'SHOULD_COMPLETE']).default('MUST_COMPLETE'),
  notes: z.string().optional(),
})

// GET /api/tasks/[id]/dependencies - Get task dependencies
export async function GET(
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
    // Get task
    const task = await db.task.findUnique({
      where: { id },
      include: {
        dependsOn: {
          select: { id: true },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Get dependency tasks
    const dependencyTasks = task.dependsOn
      ? await db.task.findMany({
          where: { id: { in: task.dependsOn } },
        })
      : []

    // Check if user has access
    if (!canPerformAction({ role: user.role, action: 'view' })) {
      return NextResponse.json({ error: 'Forbidden - No access to task dependencies' }, { status: 403 })
    }

    // Format dependencies
    const dependencies = task.dependsOn.map(depId => {
      const depTask = dependencyTasks.find(t => t.id === depId)
      return {
        taskId: depId,
        task: depTask ? {
          id: depTask.id,
          title: depTask.title,
          status: depTask.status,
          assignedTo: depTask.assignedTo,
        } : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          dependsOn: task.dependsOn,
        },
        dependencies,
      },
    })
  } catch (error) {
    console.error('Get task dependencies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks/[id]/dependencies - Add dependency to task
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
    const validatedData = addDependencySchema.parse(body)

    // Get task
    const task = await db.task.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if user has access (can edit task)
    if (!canPerformAction({ role: user.role, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to add dependencies' }, { status: 403 })
    }

    // Validate no circular dependency
    if (task.dependsOn.includes(validatedData.dependsOnId)) {
      return NextResponse.json({ error: 'Circular dependency detected' }, { status: 400 })
    }

    // Add dependency
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        dependsOn: [...task.dependsOn, validatedData.dependsOnId],
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          dependsOn: updatedTask.dependsOn,
        },
        dependency: {
          taskId: validatedData.dependsOnId,
          type: validatedData.dependencyType,
          notes: validatedData.notes,
          addedAt: new Date(),
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Add task dependency error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]/dependencies/[depId] - Remove dependency
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; depId: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, depId } = await params
  const user = auth.user

  try {
    // Get task
    const task = await db.task.findUnique({
      where: { id },
      select: { dependsOn: true },
    })

    if (!task || !task.dependsOn.includes(depId)) {
      return NextResponse.json({ error: 'Dependency not found' }, { status: 404 })
    }

    // Check if user has access (can edit task)
    if (!canPerformAction({ role: user.role, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to remove dependencies' }, { status: 403 })
    }

    // Remove dependency
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        dependsOn: task.dependsOn.filter(d => d !== depId),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: updatedTask.id,
          title: task.title,
          dependsOn: updatedTask.dependsOn,
        },
        removedDependency: {
          taskId: depId,
          removedAt: new Date(),
        },
      },
    })
  } catch (error) {
    console.error('Remove task dependency error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
