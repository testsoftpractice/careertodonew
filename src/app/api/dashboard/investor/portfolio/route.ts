import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/portfolio - Get investor's portfolio overview
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['INVESTOR', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get investor's investments
    const investments = await db.investment.findMany({
      where: { userId: user.id },
      include: {
        project: {
          select: { id: true, name: true, status: true, seekingInvestment: true }
        }
      },
      orderBy: { investedAt: 'desc' },
      take: 20
    })

    // Calculate portfolio stats
    const totalInvested = investments.reduce((inv, sum) => sum + (inv.amount || 0), 0)
    const activeInvestments = investments.filter(i => i.status === 'ACTIVE').length
    const completedInvestments = investments.filter(i => i.status === 'COMPLETED').length

    // Transform investments to expected format
    const portfolioInvestments = investments.map((inv, index) => {
      const invested = inv.amount || 0
      // Since we don't have actual current values, use a simple calculation
      // In production, this would come from real-time valuation data
      const currentVal = invested * (1 + (Math.random() * 0.1 - 0.05)) // Small variation for demo
      const roi = invested > 0 ? ((currentVal - invested) / invested) * 100 : 0

      return {
        id: inv.id,
        name: inv.project?.name || `Investment ${index + 1}`,
        project: inv.project,
        amount: invested,
        currentValue: currentVal,
        equity: inv.equity || 10,
        roi: roi,
        status: inv.status,
        investedAt: inv.investedAt,
        updatedAt: inv.updatedAt
      }
    })

    const totalValue = portfolioInvestments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
    const totalROI = totalValue - totalInvested

    return NextResponse.json({
      success: true,
      data: {
        investments: portfolioInvestments,
        totalValue: totalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        totalROI: totalROI.toFixed(2),
        activeInvestments,
        completedInvestments
      }
    })
  } catch (error) {
    console.error('Get portfolio error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio'
    }, { status: 500 })
  }
}
