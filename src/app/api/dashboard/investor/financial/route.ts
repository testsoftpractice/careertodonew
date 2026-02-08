import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/financial - Get investor's financial metrics
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

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get investor's investments
    const investments = await db.investment.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: { investedAt: 'desc' },
      take: 20
    })

    // Calculate current month metrics
    const totalInvested = (investments || []).reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const currentRevenue = totalInvested * 0.1 + Math.random() * 50000
    const currentExpenses = totalInvested * 0.05
    const currentProfit = currentRevenue - currentExpenses

    // Calculate previous month (mock)
    const previousRevenue = currentRevenue * (0.8 + Math.random() * 0.2)
    const previousExpenses = currentExpenses * (0.8 + Math.random() * 0.2)
    const previousProfit = previousRevenue - previousExpenses

    // Calculate year-to-date (mock)
    const totalRevenue = currentRevenue * 6
    const totalProfit = currentProfit * 6

    // Generate monthly data (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthRevenue = currentRevenue * (0.8 + Math.random() * 0.4)
      const monthExpenses = currentExpenses * (0.8 + Math.random() * 0.4)
      const monthProfit = monthRevenue - monthExpenses
      const monthInvested = totalInvested / 6

      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))

      return {
        period: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthProfit,
        roi: monthInvested > 0 ? ((monthProfit / monthInvested) * 100) : 0
      }
    })

    const currentMetrics = {
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      revenue: currentRevenue,
      expenses: currentExpenses,
      profit: currentProfit,
      roi: totalInvested > 0 ? ((currentProfit / totalInvested) * 100) : 0
    }

    const previousMetrics = {
      period: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      revenue: previousRevenue,
      expenses: previousExpenses,
      profit: previousProfit,
      roi: totalInvested > 0 ? ((previousProfit / totalInvested) * 100) : 0
    }

    return NextResponse.json({
      success: true,
      data: {
        currentMetrics,
        previousMetrics,
        totalRevenue,
        totalProfit,
        monthlyData
      }
    })
  } catch (error: any) {
    console.error('Get financial metrics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial metrics' },
      { status: 500 }
    )
  }
}
