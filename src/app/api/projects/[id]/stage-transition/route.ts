import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled, PROJECT_LIFECYCLE } from '@/lib/features/flags'

// POST /api/projects/[id]/stage-transition - Request to move to next stage
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isFeatureEnabled(PROJECT_LIFECYCLE)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  return NextResponse.json({
    success: true,
    message: 'Project stage transition feature is not yet implemented',
  })
}
