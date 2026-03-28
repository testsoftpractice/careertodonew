import { NextRequest, NextResponse } from 'next/server'
import { getUserIPHistory, getUserUniqueIPs, getUserIPStats } from '@/lib/ip-tracking'
import { db } from '@/lib/db'

// GET /api/admin/users/[id]/ip-history - Get IP history for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const ipAddress = searchParams.get('ipAddress') || undefined
    const action = searchParams.get('action') || undefined
    const status = searchParams.get('status') || undefined
    const view = searchParams.get('view') || 'history' // 'history' or 'unique' or 'stats'

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

    // Return different views based on query parameter
    if (view === 'unique') {
      const uniqueIPs = await getUserUniqueIPs(userId)
      return NextResponse.json({
        success: true,
        data: uniqueIPs,
      })
    } else if (view === 'stats') {
      const stats = await getUserIPStats(userId)
      return NextResponse.json({
        success: true,
        data: stats,
      })
    } else {
      // Default: return history
      const history = await getUserIPHistory(userId, {
        limit,
        offset,
        ipAddress,
        action,
        status,
      })

      return NextResponse.json({
        success: true,
        data: history,
      })
    }
  } catch (error) {
    console.error('[IP-HISTORY] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch IP history',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
