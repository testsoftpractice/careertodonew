import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// Validation schemas
const createDependencySchema = z.object({
  taskId: z.string(),
  dependsOnId: z.string(),
})

// GET /api/tasks/[id]/dependencies - Get task dependencies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if ('status' in auth) return auth

  const { id: taskId } = await params

  try {
    const dependencies = await db.taskDependency.findMany({
      where: {
        taskId,
      },
      include: {
        dependsOn: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
            ownerId: true,
          },
        },
        taskAssignees: {
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
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: dependencies,
      count: dependencies.length,
    })
  } catch (error) {
    console.error('Get task dependencies error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch task dependencies',
    }, { status: 500 })
  }
}

// POST /api/tasks/[id]/dependencies - Add task dependency
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if ('status' in auth) return auth

  const { id: taskId } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = createDependencySchema.parse(body)

    // Check if task exists and user has permission
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { projectId: true, assignedBy: true },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only task creator or project owner can add dependencies
    const project = await db.project.findUnique({
      where: { id: task.projectId },
      select: { ownerId: true },
    })

    if (!project || (task.assignedBy !== user.id && project.ownerId !== user.id)) {
      return NextResponse.json({
        error: 'Forbidden - Only task creator or project owner can add dependencies',
      }, { status: 403 })
    }

    // Check if dependency task exists
    const dependsOnTask = await db.task.findUnique({
      where: { id: validatedData.dependsOnId },
      select: { projectId: true },
    })

    if (!dependsOnTask) {
      return NextResponse.json({ error: 'Dependency task not found' }, { status: 404 })
    }

    // Prevent circular dependencies
    const existingReverse = await db.taskDependency.findFirst({
      where: {
        taskId: validatedData.dependsOnId,
        dependsOnId: taskId,
      },
    })

    if (existingReverse) {
      return NextResponse.json({
        error: 'Circular dependency detected',
      }, { status: 400 })
    }

    // Prevent duplicate dependencies
    const existingDep = await db.taskDependency.findFirst({
      where: {
        taskId,
        dependsOnId: validatedData.dependsOnId,
      },
    })

    if (existingDep) {
      return NextResponse.json({
        error: 'Dependency already exists',
      }, { status: 400 })
    }

    const dependency = await db.taskDependency.create({
      data: {
        taskId,
        dependsOnId: validatedData.dependsOnId,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        dependency,
        message: 'Task dependency added successfully',
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Add task dependency error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add task dependency',
    }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]/dependencies - Remove task dependency
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request)
  if ('status' in auth) return auth

  const { id: taskId } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const { depId } = body

    if (!depId) {
      return NextResponse.json({ error: 'Dependency ID is required' }, { status: 400 })
    }

    const dependency = await db.taskDependency.findUnique({
      where: { id: depId },
    })

    if (!dependency) {
      return NextResponse.json({ error: 'Dependency not found' }, { status: 404 })
    }

    // Check permission - task creator or project owner can remove
    const task = await db.task.findUnique({
      where: { id: dependency.taskId },
      select: { projectId: true, assignedBy: true },
    })

    const project = await db.project.findUnique({
      where: { id: task.projectId },
      select: { ownerId: true },
    })

    if (!project || (task.assignedBy !== user.id && project.ownerId !== user.id)) {
      return NextResponse.json({
        error: 'Forbidden - Only task creator or project owner can remove dependencies',
      }, { status: 403 })
    }

    await db.taskDependency.delete({
      where: { id: depId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Task dependency removed successfully',
      },
    })
  } catch (error) {
    console.error('Remove task dependency error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to remove task dependency',
    }, { status: 500 })
  }
}
