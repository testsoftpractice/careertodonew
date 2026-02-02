import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/investor/deals - Get investor's deal flow
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get investor's deals (from investments)
    const investments = await db.investment.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        project: {
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
    const activeDeals = investments.filter(i => i.status === 'ACTIVE').length
    const pipelineValue = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

    // Transform to deal format
    const deals = investments.slice(0, 5).map((inv, index) => {
      const amount = inv.amount || 0
      const equity = inv.equity || 5

      return {
        id: inv.id,
        startupName: inv.project?.name || `Startup ${index + 1}`,
        industry: 'Technology',
        stage: ['seed' as const, 'series_a' as const, 'series_b' as const][index % 3],
        amount: amount,
        equity: equity,
        status: inv.status === 'ACTIVE' ? 'negotiating' as const :
                inv.status === 'COMPLETED' ? 'closed' as const :
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
  } catch (error: any) {
    console.error('Get deal flow error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal flow' },
      { status: 500 }
    )
  }
}
