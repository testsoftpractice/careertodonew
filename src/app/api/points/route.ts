import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PointSource } from '@prisma/client'

// ==================== POINTS API ====================

// Point values configuration
const POINT_VALUES = {
  BUSINESS_CREATION: 100,
  TASK_COMPLETION: 10,
  MILESTONE_ACHIEVEMENT: 25,
  JOB_APPLICATION: 5,
  COLLABORATION: 15,
  VERIFICATION_APPROVED: 20,
  UNIVERSITY_ACHIEVEMENT: 30,
  RATING_RECEIVED: 5,
  REFERRAL: 50,
  EVENT_PARTICIPATION: 10,
}

// GET: Fetch points history, stats, or leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined
    const leaderboard = searchParams.leaderboard === 'true'
    const stats = searchParams.stats === 'true'

    // Fetch leaderboard
    if (leaderboard) {
      const users = await db.user.findMany({
        where: {
          totalPoints: { gt: 0 },
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          totalPoints: true,
          role: true,
          university: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: { totalPoints: 'desc' },
        take: 50,
      })

      const leaderboardWithRank = users.map((user, index) => ({
        ...user,
        rank: index + 1,
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
        select: { totalPoints: true },
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
        }, { status: 404 })
      }

      const transactions = await db.pointTransaction.findMany({
        where: { userId },
        select: {
          source: true,
          points: true,
          createdAt: true,
        },
      })

      const breakdown: Record<string, number> = {}
      let totalEarned = 0
      let thisWeekPoints = 0
      let thisMonthPoints = 0

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      transactions.forEach((tx) => {
        // Breakdown by source
        const source = tx.source
        breakdown[source] = (breakdown[source] || 0) + tx.points

        // Total earned
        if (tx.points > 0) {
          totalEarned += tx.points
        }

        // This week
        const txDate = tx.createdAt
        if (txDate > weekAgo) {
          thisWeekPoints += tx.points
        }

        // This month
        if (txDate > monthAgo) {
          thisMonthPoints += tx.points
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          totalPoints: user.totalPoints,
          totalEarned,
          breakdown,
          thisWeekPoints,
          thisMonthPoints,
        },
      })
    }

    // Fetch points history for a user
    if (userId) {
      const transactions = await db.pointTransaction.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })

      return NextResponse.json({
        success: true,
        data: transactions,
        count: transactions.length,
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

// POST: Award points to a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { userId, source, description, metadata, customPoints } = body

    if (!userId || !source || !description) {
      return NextResponse.json({
        success: false,
        error: 'userId, source, and description are required',
      }, { status: 400 })
    }

    // Validate source
    const validSources = Object.values(PointSource)
    if (!validSources.includes(source as PointSource)) {
      return NextResponse.json({
        success: false,
        error: `Invalid source. Must be one of: ${validSources.join(', ')}`,
      }, { status: 400 })
    }

    // Get point value
    const points = customPoints !== undefined ? customPoints : POINT_VALUES[source as keyof typeof POINT_VALUES] || 0

    // Create point transaction and update user total in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create point transaction
      const transaction = await tx.pointTransaction.create({
        data: {
          userId,
          points,
          source: source as PointSource,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      })

      // Update user's total points
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalPoints: {
            increment: points,
          },
        },
        select: {
          id: true,
          totalPoints: true,
          name: true,
        },
      })

      return { transaction, updatedUser }
    })

    return NextResponse.json({
      success: true,
      data: {
        transaction: result.transaction,
        user: result.updatedUser,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Points award error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to award points',
    }, { status: 500 })
  }
}

// DELETE: Revoke points (admin only in production)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.id as string

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID is required',
      }, { status: 400 })
    }

    // Get the transaction before deleting
    const transaction = await db.pointTransaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found',
      }, { status: 404 })
    }

    // Delete transaction and update user total
    const result = await db.$transaction(async (tx) => {
      const deletedTx = await tx.pointTransaction.delete({
        where: { id: transactionId },
      })

      const updatedUser = await tx.user.update({
        where: { id: transaction.userId },
        data: {
          totalPoints: {
            decrement: transaction.points,
          },
        },
        select: {
          id: true,
          totalPoints: true,
        },
      })

      return { deletedTx, updatedUser }
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedTransaction: result.deletedTx,
        user: result.updatedUser,
      },
    })
  } catch (error) {
    console.error('Points revoke error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to revoke points',
    }, { status: 500 })
  }
}
