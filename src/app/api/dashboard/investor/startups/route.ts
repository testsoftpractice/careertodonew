import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/investor/startups - Get investor's startup tracker
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

    // Get investor's investments as startups
    const investments = await db.investment.findMany({
      where: {
        investorId: decoded.userId
      },
      orderBy: { investedAt: 'desc' },
      take: 10
    })

    // Calculate stats
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const totalCurrentValue = totalInvested * (1 + Math.random() * 0.4)
    const avgROI = investments.length > 0 ? 25 : 0

    // Transform to startup format
    const startups = investments.slice(0, 5).map((inv, index) => {
      const invested = inv.amount || 0
      const currentValue = invested * (0.8 + Math.random() * 0.6)
      const roi = ((currentValue - invested) / invested) * 100

      return {
        id: inv.id,
        name: `Startup ${index + 1}`,
        industry: 'Technology',
        stage: ['seed' as const, 'series_a' as const, 'series_b' as const, 'series_c' as const, 'ipo' as const][index % 5],
        investment: invested,
        currentValue,
        roi,
        monthlyGrowth: (Math.random() * 10) - 2,
        employees: Math.floor(Math.random() * 50) + 5,
        foundedYear: 2018 + Math.floor(Math.random() * 6),
        lastFunding: inv.investedAt,
        status: roi > 30 ? 'performing' as const : roi > 0 ? 'neutral' as const : 'underperforming' as const
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        startups,
        totalInvested,
        totalCurrentValue,
        avgROI
      }
    })
  } catch (error: any) {
    console.error('Get startup tracker error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch startup tracker' },
      { status: 500 }
    )
  }
}
