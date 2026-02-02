import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/stats - Get investor dashboard statistics
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
          select: { id: true, name: true, status: true }
        }
      },
      orderBy: { investedAt: 'desc' }
    })

    // Calculate statistics
    const totalInvestments = investments.length
    const activeInvestments = investments.filter(i => i.status === 'ACTIVE').length
    const completedInvestments = investments.filter(i => i.status === 'COMPLETED').length
    const totalInvested = investments.reduce((sum, i) => sum + (i.amount || 0), 0)

    // Calculate average return
    const completedInvestmentsWithValue = investments.filter(i => i.status === 'COMPLETED' && (i.projectedReturn || 0) > 0)
    const totalProjectedReturn = completedInvestmentsWithValue.reduce((sum, i) => sum + (i.projectedReturn || 0), 0)
    const avgReturn = completedInvestmentsWithValue.length > 0 ? totalProjectedReturn / completedInvestmentsWithValue.length : 0

    // Calculate equity (equity percentage)
    const totalEquity = investments.reduce((sum, i) => sum + (i.equity || 0), 0)

    // Get opportunity pipeline (projects seeking investment)
    const opportunities = await db.project.findMany({
      where: { seekingInvestment: true, status: { in: ['IDEA', 'FUNDING', 'IN_PROGRESS'] } },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const totalOpportunities = opportunities.length

    const stats = {
      totalInvestments,
      activeInvestments,
      completedInvestments,
      totalInvested,
      avgReturn: parseFloat(avgReturn.toFixed(2)),
      totalEquity: parseFloat(totalEquity.toFixed(2)),
      totalOpportunities
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Get investor stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch investor statistics'
    }, { status: 500 })
  }
}
