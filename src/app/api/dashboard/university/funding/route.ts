import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/university/funding - Get university funding overview
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

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get university info
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { universityId: true }
    })

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No university associated' },
        { status: 400 }
      )
    }

    // Get projects for budget calculation
    const projects = await db.project.findMany({
      where: {
        universityId: user.universityId
      },
      take: 10
    })

    // Mock funding data
    const totalFunding = 10000000 + Math.floor(Math.random() * 50000000)
    const totalSpent = totalFunding * (0.6 + Math.random() * 0.2)
    const annualBudget = totalFunding
    const revenue = totalFunding * (0.8 + Math.random() * 0.2)
    const expenses = totalSpent

    // Mock funding sources
    const sources = [
      {
        id: 'gov-1',
        name: 'Government Grants',
        type: 'government' as const,
        amount: totalFunding * 0.4,
        spent: totalFunding * 0.35,
        year: 2024,
        growth: Math.floor(Math.random() * 10)
      },
      {
        id: 'corp-1',
        name: 'Corporate Sponsorships',
        type: 'corporate' as const,
        amount: totalFunding * 0.3,
        spent: totalFunding * 0.28,
        year: 2024,
        growth: Math.floor(Math.random() * 15)
      },
      {
        id: 'private-1',
        name: 'Private Donations',
        type: 'private' as const,
        amount: totalFunding * 0.2,
        spent: totalFunding * 0.15,
        year: 2024,
        growth: Math.floor(Math.random() * 8)
      },
      {
        id: 'grant-1',
        name: 'Research Grants',
        type: 'grant' as const,
        amount: totalFunding * 0.1,
        spent: totalFunding * 0.08,
        year: 2024,
        growth: Math.floor(Math.random() * 12)
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        totalFunding,
        totalSpent,
        annualBudget,
        revenue,
        expenses,
        sources
      }
    })
  } catch (error: any) {
    console.error('Get funding overview error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch funding overview' },
      { status: 500 }
    )
  }
}
