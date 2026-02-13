import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, TASK_MANAGEMENT } from '@/lib/features/flags'

// GET /api/tasks/[id]/checklist - Get task checklist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  // Task checklist feature not yet implemented
  return NextResponse.json({ error: 'Task checklist feature not yet implemented' }, { status: 501 })
}

// POST /api/tasks/[id]/checklist - Add checklist item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  // Task checklist feature not yet implemented
  return NextResponse.json({ error: 'Task checklist feature not yet implemented' }, { status: 501 })
}

// PUT /api/tasks/[id]/checklist - Update checklist item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  // Task checklist feature not yet implemented
  return NextResponse.json({ error: 'Task checklist feature not yet implemented' }, { status: 501 })
}

// DELETE /api/tasks/[id]/checklist - Delete checklist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(TASK_MANAGEMENT)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  // Task checklist feature not yet implemented
  return NextResponse.json({ error: 'Task checklist feature not yet implemented' }, { status: 501 })
}
