import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, PROJECT_LIFECYCLE } from '@/lib/features/flags'

// GET /api/projects/[id]/lifecycle - Get project lifecycle history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  return NextResponse.json({
    success: true,
    message: 'Project lifecycle tracking feature is not yet implemented',
    data: {
      projectId: (await params).id,
      currentStage: 'DRAFT',
      stageHistory: [],
    },
  })
}

// POST /api/projects/[id]/lifecycle - Add lifecycle entry (move to next stage)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  return NextResponse.json({
    success: true,
    message: 'Project lifecycle tracking feature is not yet implemented',
  })
}

// PUT /api/projects/[id]/lifecycle - Update lifecycle entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  return NextResponse.json({
    success: true,
    message: 'Project lifecycle tracking feature is not yet implemented',
  })
}

// DELETE /api/projects/[id]/lifecycle - Delete lifecycle entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  return NextResponse.json({
    success: true,
    message: 'Project lifecycle tracking feature is not yet implemented',
  })
}
