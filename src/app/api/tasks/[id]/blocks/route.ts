import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// POST /api/tasks/[id]/blocks - Block task (prevent work)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  // Task blocking feature not yet implemented
  return NextResponse.json({ error: 'Task blocking feature not yet implemented' }, { status: 501 })
}
