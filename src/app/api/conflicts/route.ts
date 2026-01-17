import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// GET /api/conflicts - Detect all task conflicts
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  try {
    // Get all tasks (in production, would be project-scoped)
    const tasks = await db.task.findMany()

    return NextResponse.json({
      success: true,
      data: {
        totalConflicts: tasks.length, // Mock - would calculate real conflicts
      },
    })
  } catch (error) {
    console.error('Get conflicts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
