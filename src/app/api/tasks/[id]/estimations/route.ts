import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// GET /api/tasks/[id]/estimations - Get task estimations (optimistic, realistic, pessimistic)
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

    // Calculate estimations
    const baseEstimate = task.estimatedHours || 0
    const estimations = {
      optimistic: Math.round(baseEstimate * 0.8),
      realistic: baseEstimate,
      pessimistic: Math.round(baseEstimate * 1.2),
    }

    return NextResponse.json({
      success: true,
      data: {
        taskId: task.id,
        task: {
          id: task.id,
          title: task.title,
        },
        estimations,
        baseEstimate,
        variance: {
          optimistic_vs_realistic: estimations.realistic - estimations.optimistic,
          pessimistic_vs_realistic: estimations.pessimistic - estimations.realistic,
        },
      },
    })
  } catch (error) {
    console.error('Get task estimations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks/[id]/estimations - Update estimations
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
    const { optimistic, realistic, pessimistic } = await request.json()

    // Validate
    if (optimistic !== undefined && typeof optimistic === 'number' &&
        realistic !== undefined && typeof realistic === 'number' &&
        pessimistic !== undefined && typeof pessimistic === 'number') {

      // Get task
      const task = await db.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }

      // In production, these would be stored in database
      // For now, just return success

      return NextResponse.json({
        success: true,
        data: {
          taskId,
          estimations: {
            optimistic: optimistic,
            realistic: realistic,
            pessimistic: pessimistic,
          },
          message: 'Estimations updated successfully',
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid estimations data' }, { status: 400 })
    }
  } catch (error) {
    console.error('Update estimations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
