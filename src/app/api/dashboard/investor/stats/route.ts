import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, errorResponse } from '@/lib/api-response'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/stats - Get investor dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const user = authResult.user

    // Get investor's investments
    const investments = await db.investment.findMany({
      where: { userId: user.id },
      include: {
        project: {
          select: { id: true, name: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate statistics based on proper statuses
    // FUNDED = completed investments
    // AGREED/UNDER_REVIEW/PENDING/INTERESTED = active deals
    const fundedInvestments = (investments || []).filter(i => i.status === 'FUNDED')
    const activeDeals = (investments || []).filter(i => 
      ['AGREED', 'UNDER_REVIEW', 'PENDING', 'INTERESTED'].includes(i.status)
    )
    
    const totalInvested = (fundedInvestments || []).reduce((sum, i) => sum + (i.amount || 0), 0)
    const totalEquity = (fundedInvestments || []).reduce((sum, i) => sum + (i.equity || 0), 0)
    
    // Calculate average return from projected returns
    const investmentsWithReturns = (fundedInvestments || []).filter(i => (i.projectedReturn || 0) > 0)
    const totalProjectedReturn = (investmentsWithReturns || []).reduce((sum, i) => sum + (i.projectedReturn || 0), 0)
    const avgReturn = fundedInvestments.length > 0 
      ? ((totalProjectedReturn - totalInvested) / totalInvested) * 100 
      : 0

    // Get opportunity pipeline (projects seeking investment that are APPROVED)
    const opportunities = await db.project.findMany({
      where: { 
        seekingInvestment: true, 
        approvalStatus: 'APPROVED',
        status: { in: ['IDEA', 'FUNDING', 'IN_PROGRESS'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const totalOpportunities = opportunities.length

    const stats = {
      totalInvestments: fundedInvestments.length,
      activeDeals: activeDeals.length,
      totalInvested,
      avgReturn: parseFloat(avgReturn.toFixed(2)),
      totalEquity: parseFloat(totalEquity.toFixed(2)),
      totalOpportunities
    }

    return NextResponse.json({
      success: true,
      data: stats
    }, {
      headers: {
        'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get investor stats error:', error)
    return errorResponse('Failed to fetch investor statistics', 500)
  }
}
