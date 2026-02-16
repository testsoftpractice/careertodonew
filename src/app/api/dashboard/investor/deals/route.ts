import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, unauthorized } from '@/lib/api-response'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/deals - Get investor's deal flow
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    // Get investor's deals (from investments)
    const investments = await db.investment.findMany({
      where: {
        userId: authResult.user.id
      },
      include: {
        Project: {
          select: { id: true, name: true, status: true }
        }
      },
      orderBy: { investedAt: 'desc' },
      take: 10
    })

    // Get projects seeking investment
    const projects = await db.project.findMany({
      where: {
        seekingInvestment: true,
        status: { in: ['IDEA', 'FUNDING', 'IN_PROGRESS'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calculate stats
    const totalDeals = investments.length
    const activeDeals = investments.filter(i => ['AGREED', 'UNDER_REVIEW', 'PENDING'].includes(i.status)).length
    const pipelineValue = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

    // Transform to deal format
    const deals = investments.slice(0, 5).map((inv, index) => {
      const amount = inv.amount || 0
      const equity = inv.equity || 5

      return {
        id: inv.id,
        startupName: inv.Project?.name || `Startup ${index + 1}`,
        industry: 'Technology',
        stage: ['seed' as const, 'series_a' as const, 'series_b' as const][index % 3],
        amount: amount,
        equity: equity,
        status: ['AGREED', 'UNDER_REVIEW'].includes(inv.status) ? 'negotiating' as const :
                inv.status === 'FUNDED' ? 'closed' as const :
                'diligence' as const,
        valuation: amount * 2,
        expectedROI: 20 + Math.random() * 30,
        createdAt: inv.investedAt || inv.createdAt
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        deals,
        totalDeals,
        activeDeals,
        pipelineValue
      }
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get deal flow error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal flow' },
      { status: 500 }
    )
  }
}
