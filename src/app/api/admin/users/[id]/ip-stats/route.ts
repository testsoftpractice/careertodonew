import { NextRequest, NextResponse } from 'next/server'
import { getUserIPStats } from '@/lib/ip-tracking'
import { db } from '@/lib/db'

// GET /api/admin/users/[id]/ip-stats - Get IP statistics for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const stats = await getUserIPStats(userId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('[IP-STATS] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch IP statistics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
