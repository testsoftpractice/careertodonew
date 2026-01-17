import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { canPerformAction } from '@/lib/models/project-roles'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// Validation schemas
const addChecklistItemSchema = z.object({
  item: z.string().min(1).max(200),
  completed: z.boolean().default(false),
})

const updateChecklistItemSchema = z.object({
  item: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
  completedBy: z.string().optional(),
  completedAt: z.string().datetime().optional(),
})

// GET /api/tasks/[id]/checklist - Get task checklist
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
  const taskId = id
  const user = auth.user

  try {
    // Get task
    const task = await db.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Get checklist
    const checklist = await db.taskChecklist.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    })

    // Check if user has access
    if (!canPerformAction({ role: user.userRole, action: 'view' })) {
      return NextResponse.json({ error: 'Forbidden - No access to task checklist' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
        },
        checklist,
      },
    })
  } catch (error) {
    console.error('Get task checklist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks/[id]/checklist - Add checklist item
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
  const taskId = id
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = addChecklistItemSchema.parse(body)

    // Check if user can edit task
    if (!canPerformAction({ role: user.userRole, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to add checklist items' }, { status: 403 })
    }

    // Create checklist item
    const checklistItem = await db.taskChecklist.create({
      data: {
        taskId,
        item: validatedData.item,
        completed: validatedData.completed,
        completedBy: validatedData.completed ? user.id : null,
        completedAt: validatedData.completed ? new Date() : null,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        checklistItem,
        message: 'Checklist item added successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Add checklist item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/tasks/[id]/checklist/[itemId] - Update checklist item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, itemId } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = updateChecklistItemSchema.parse(body)

    // Get checklist item
    const checklistItem = await db.taskChecklist.findUnique({
      where: { id: itemId },
    })

    if (!checklistItem) {
      return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 })
    }

    // Check if user can edit
    if (!canPerformAction({ role: user.userRole, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to update checklist item' }, { status: 403 })
    }

    // Update checklist item
    const updatedItem = await db.taskChecklist.update({
      where: { id: itemId },
      data: {
        ...validatedData,
        completedAt: validatedData.completed ? new Date() : null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        checklistItem: updatedItem,
        message: 'Checklist item updated successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Update checklist item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]/checklist/[itemId] - Delete checklist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const { id, itemId } = await params
  const user = auth.user

  try {
    // Get checklist item
    const checklistItem = await db.taskChecklist.findUnique({
      where: { id: itemId },
    })

    if (!checklistItem) {
      return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 })
    }

    // Check if user can edit (delete requires edit)
    if (!canPerformAction({ role: user.userRole, action: 'edit' })) {
      return NextResponse.json({ error: 'Forbidden - No permission to delete checklist item' }, { status: 403 })
    }

    // Delete checklist item
    await db.taskChecklist.delete({
      where: { id: itemId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Checklist item deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete checklist item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
