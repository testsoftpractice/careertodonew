import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== POINTS API ====================
// Simplified version - points system needs to be added to schema

// GET: Fetch points stats for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const leaderboard = searchParams.leaderboard === 'true'
    const stats = searchParams.stats === 'true'

    // Fetch leaderboard
    if (leaderboard) {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          university: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })

      const leaderboardWithRank = users.map((user, index) => ({
        ...user,
        rank: index + 1,
        totalPoints: 0, // Placeholder until points system is added
      }))

      return NextResponse.json({
        success: true,
        data: leaderboardWithRank,
      })
    }

    // Fetch stats for a specific user
    if (stats && userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          executionScore: true,
          collaborationScore: true,
          leadershipScore: true,
          ethicsScore: true,
          reliabilityScore: true,
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          totalPoints: 0, // Placeholder
          totalEarned: 0,
          breakdown: {},
          thisWeekPoints: 0,
          thisMonthPoints: 0,
        },
      })
    }

    // Fetch points history for a user
    if (userId) {
      // Return empty array until points system is added
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request. Provide userId, stats=true, or leaderboard=true',
    }, { status: 400 })
  } catch (error) {
    console.error('Points API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch points data',
    }, { status: 500 })
  }
}

// POST: Award points to a user (placeholder)
export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'Points system needs to be implemented in schema',
  }, { status: 501 })
}
