import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// Validation schemas
const createTimeEntrySchema = z.object({
  hours: z.number().min(0.5).max(24).step(0.25),
  description: z.string().optional(),
  billable: z.boolean().default(false),
  hourlyRate: z.number().min(0).max(1000).optional(),
})

const updateTimeEntrySchema = z.object({
  hours: z.number().min(0.5).max(24).step(0.25).optional(),
  description: z.string().optional(),
  entryId: z.string(),
})

// GET /api/tasks/[id]/time-entries - Get time entries for task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: taskId } = await params
  const user = auth.user

  try {
    // Check if user has access (task owner or with time tracking permission)
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        taskAssignees: {
          where: { userId: user.userId },
          take: 1,
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const isTaskAssignee = task.taskAssignees.length > 0
    const isCreator = task.assignedBy === user.userId

    if (!isCreator && !isTaskAssignee) {
      return NextResponse.json({ error: 'Forbidden - No access to this task' }, { status: 403 })
    }

    // Get time entries
    const timeEntries = await db.timeEntry.findMany({
      where: { taskId },
      orderBy: { date: 'desc' },
    })

    // Calculate total hours
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

    return NextResponse.json({
      success: true,
      data: {
        taskId,
        timeEntries: timeEntries.map(entry => ({
          id: entry.id,
          hours: entry.hours,
          description: entry.description,
          billable: entry.billable,
          hourlyRate: entry.hourlyRate,
          date: entry.date,
        })),
        totalHours,
        totalBillable: timeEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0) * (timeEntries[0]?.hourlyRate || 0),
      },
    })
  } catch (error) {
    console.error('Get time entries error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks/[id]/time-entries - Add time entry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const paramsResolved = await params
  const taskId = paramsResolved.id
  const user = auth.user

  try {
    // Check if user has access - allow task owner, task assignee, or project owner
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        taskAssignees: {
          where: { userId: user.userId },
          take: 1,
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Get project to check ownership
    if (!task.projectId) {
      return NextResponse.json({ error: 'Task must belong to a project' }, { status: 400 })
    }

    const project = await db.project.findUnique({
      where: { id: task.projectId },
      select: { ownerId: true },
    })

    const isTaskAssignee = task.taskAssignees.length > 0
    const isProjectOwner = project?.ownerId === user.userId

    // Allow if task assignee, creator, or project owner
    if (!isTaskAssignee && task.assignedBy !== user.userId && !isProjectOwner) {
      return NextResponse.json({ error: 'Forbidden - No access to add time entries to this task' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createTimeEntrySchema.parse(body)

    // Create time entry
    const timeEntry = await db.timeEntry.create({
      data: {
        taskId,
        userId: user.userId,
        hours: validatedData.hours,
        description: validatedData.description,
        billable: validatedData.billable,
        hourlyRate: validatedData.hourlyRate,
        date: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        timeEntry: {
          id: timeEntry.id,
          hours: timeEntry.hours,
          description: timeEntry.description,
          billable: timeEntry.billable,
        },
        message: 'Time entry added successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Create time entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/tasks/[id]/time-entries - Update time entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const validatedData = updateTimeEntrySchema.parse(body)

    if (!validatedData.entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
    }

    // Get time entry
    const timeEntry = await db.timeEntry.findUnique({
      where: { id: validatedData.entryId },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    // Check ownership
    if (timeEntry.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden - No access to update this time entry' }, { status: 403 })
    }

    // Update time entry
    const updatedEntry = await db.timeEntry.update({
      where: { id: validatedData.entryId },
      data: {
        hours: validatedData.hours,
        description: validatedData.description,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        timeEntry: {
          id: updatedEntry.id,
          hours: updatedEntry.hours,
          description: updatedEntry.description,
          billable: updatedEntry.billable,
        },
        message: 'Time entry updated successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Update time entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]/time-entries - Delete time entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const user = auth.user

  try {
    const body = await request.json()
    const { entryId } = body

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
    }

    // Get time entry
    const timeEntry = await db.timeEntry.findUnique({
      where: { id: entryId },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    // Check ownership
    if (timeEntry.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden - No access to delete this time entry' }, { status: 403 })
    }

    // Delete time entry
    await db.timeEntry.delete({
      where: { id: entryId },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Time entry deleted successfully',
      },
    })
  } catch (error) {
    console.error('Delete time entry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
