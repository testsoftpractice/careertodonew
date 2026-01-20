import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/investor/portfolio - Get investor's portfolio overview
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

    // Get investor's investments
    const investments = await db.investment.findMany({
      where: {
        investorId: decoded.userId
      },
      orderBy: { investedAt: 'desc' },
      take: 20
    })

    // Calculate portfolio stats
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const totalValue = totalInvested * (1 + Math.random() * 0.3) // Mock current value with 0-30% return
    const totalROI = totalValue - totalInvested
    const monthlyReturn = (totalROI / totalInvested) * 100 * (Math.random() > 0.5 ? 1 : -1)

    // Transform to portfolio assets format
    const assets = investments.slice(0, 8).map((inv, index) => {
      const invested = inv.amount || 0
      const currentValue = invested * (0.8 + Math.random() * 0.5)
      const roi = ((currentValue - invested) / invested) * 100

      return {
        id: inv.id,
        name: `Investment ${index + 1}`,
        type: ['equity', 'debt', 'real_estate', 'startup'][index % 4] as any,
        value: currentValue,
        invested,
        roi,
        status: roi > 20 ? 'performing' as const : roi > 0 ? 'neutral' as const : 'underperforming' as const
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalValue,
        totalInvested,
        totalROI,
        monthlyReturn,
        assets
      }
    })
  } catch (error: any) {
    console.error('Get portfolio error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
