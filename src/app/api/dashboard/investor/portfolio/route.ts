import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, unauthorized } from '@/lib/api-response'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/portfolio - Get investor's portfolio overview
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const user = authResult.user

    // Get investor's investments - only FUNDED ones are in portfolio
    const investments = await db.investment.findMany({
      where: {
        userId: user.id,
        status: 'FUNDED'
      },
      include: {
        Project: {
          select: { id: true, name: true, status: true, seekingInvestment: true, description: true }
        }
      },
      orderBy: { fundedAt: 'desc' },
      take: 20
    })

    // Get all investments for stats
    const allInvestments = await db.investment.findMany({
      where: { userId: user.id }
    })

    // Calculate portfolio stats
    const totalInvested = (investments || []).reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const activeInvestments = (allInvestments || []).filter(i =>
      ['FUNDED', 'AGREED', 'UNDER_REVIEW'].includes(i.status)
    ).length
    const totalEquity = (investments || []).reduce((sum, inv) => sum + (inv.equity || 0), 0)
    const totalProjectedReturn = (investments || []).reduce((sum, inv) => sum + (inv.projectedReturn || 0), 0)

    // Transform investments to expected format
    const portfolioInvestments = (investments || []).map((inv, index) => {
      const invested = inv.amount || 0
      const projected = inv.projectedReturn || invested
      const roi = invested > 0 ? ((projected - invested) / invested) * 100 : 0

      // Parse terms if available
      let termsData: any = {}
      try {
        termsData = inv.terms ? JSON.parse(inv.terms) : {}
      } catch (e) {
        console.error('Failed to parse terms:', e)
      }

      return {
        id: inv.id,
        name: inv.Project?.name || `Investment ${index + 1}`,
        description: inv.Project?.description || '',
        project: inv.Project || null,
        amount: invested,
        currentValue: projected,
        equity: inv.equity || 0,
        roi: roi,
        status: inv.status,
        type: inv.type,
        investedAt: inv.investedAt || inv.fundedAt || inv.createdAt,
        fundedAt: inv.fundedAt,
        projectedReturn: inv.projectedReturn,
        terms: termsData
      }
    }).filter(inv => inv.project !== null) // Only include investments with valid projects

    const totalValue = (portfolioInvestments || []).reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
    const totalROI = totalValue - totalInvested
    const avgROI = totalInvested > 0 ? (totalROI / totalInvested) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        investments: portfolioInvestments,
        totalValue: totalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        totalROI: totalROI.toFixed(2),
        totalEquity: totalEquity.toFixed(2),
        totalProjectedReturn: totalProjectedReturn.toFixed(2),
        avgROI: avgROI.toFixed(2),
        activeInvestments,
        completedInvestments: investments.length
      }
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get portfolio error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio'
    }, { status: 500 })
  }
}
