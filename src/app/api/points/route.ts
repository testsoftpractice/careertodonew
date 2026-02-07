import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { verifyAuth, requireAuth, requireRole, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, badRequest, validationError, successResponse, errorResponse } from '@/lib/api-response'

// Validation schemas
const awardPointsSchema = z.object({
  userId: z.string(),
  points: z.number().int().min(1).max(1000),
  source: z.enum(['TASK_COMPLETION', 'TASK_SUBMISSION', 'COURSE_FINISHED', 'ACHIEVEMENT_UNLOCKED', 'BONUS_AWARDED', 'POINTS_ADJUSTMENT']),
  description: z.string().optional(),
  metadata: z.string().optional(),
})

const adjustPointsSchema = z.object({
  amount: z.number().int().min(-1000).max(1000),
  reason: z.string().min(10).max(500),
})

// GET /api/points - Get points for a user
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') as string | undefined
    const leaderboard = searchParams.get('leaderboard') === 'true'
    const history = searchParams.get('history') === 'true'
    const stats = searchParams.get('stats') === 'true'

    // Fetch leaderboard (public, but requires auth)
    if (!leaderboard) {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          totalPoints: true,
          executionScore: true,
          collaborationScore: true,
          leadershipScore: true,
          ethicsScore: true,
          reliabilityScore: true,
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

      // Assign ranks
      const leaderboardWithRank = users.map((user, index) => ({
        ...user,
        rank: index + 1,
      }))

      return NextResponse.json({
        success: true,
        data: leaderboardWithRank,
      })
    }

    // Fetch points history for a user - can only view own history unless admin
    if (history) {
      // Only allow viewing own history or admin viewing any user
      if (userId !== authResult.dbUser?.id && authResult.dbUser?.role !== 'PLATFORM_ADMIN' && authResult.dbUser?.role !== 'UNIVERSITY_ADMIN') {
        return forbidden('You can only view your own points history')
      }
      const transactions = await db.pointTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })

      return NextResponse.json({
        success: true,
        data: transactions,
        count: transactions.length,
      })
    }

    // Fetch stats for a user - can only view own stats unless admin
    if (stats) {
      // Only allow viewing own stats or admin viewing any user
      if (userId !== authResult.dbUser?.id && authResult.dbUser?.role !== 'PLATFORM_ADMIN' && authResult.dbUser?.role !== 'UNIVERSITY_ADMIN') {
        return forbidden('You can only view your own points stats')
      }
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          totalPoints: true,
          executionScore: true,
          collaborationScore: true,
          leadershipScore: true,
          ethicsScore: true,
          reliabilityScore: true,
        },
      })
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Calculate this week points
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - 7))
      const thisWeekPoints = await db.pointTransaction.aggregate({
        where: {
          userId,
          createdAt: { gte: weekStart },
        },
        _sum: {
          points: true,
        },
      })

      // Calculate this month points
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisMonthPoints = await db.pointTransaction.aggregate({
        where: {
          userId,
          createdAt: { gte: monthStart },
        },
        _sum: {
          points: true,
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          totalPoints: user.totalPoints || 0,
          thisWeekPoints: thisWeekPoints._sum.points || 0,
          thisMonthPoints: thisMonthPoints._sum.points || 0,
          breakdown: {
            execution: user.executionScore,
            collaboration: user.collaborationScore,
            leadership: user.leadershipScore,
            ethics: user.ethicsScore,
            reliability: user.reliabilityScore,
          },
        },
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Please provide userId, stats=true, or leaderboard=true',
    }, { status: 400 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Points API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch points data',
    }, { status: 500 })
  }
}

// POST /api/points/award - Award points to a user (admin/mentor only)
export async function POST(request: NextRequest) {
  try {
    // Require admin or mentor role to award points
    let authResult
    try {
      authResult = await requireRole(request, ['PLATFORM_ADMIN', 'UNIVERSITY_ADMIN', 'MENTOR'])
    } catch (error) {
      if (error instanceof AuthError) {
        return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
      }
      if (!authResult) {
        return forbidden('Only admins and mentors can award points')
      }
      throw error
    }

    const body = await request.json()
    const validatedData = awardPointsSchema.parse(body)

    const { userId, points, source, description, metadata } = validatedData

    // Award points and update user total
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        totalPoints: true,
      executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true,
      },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update scores based on point source
    const scoreUpdate: Record<string, number> = {}
    if (source === 'TASK_COMPLETION' || source === 'TASK_SUBMISSION') {
      scoreUpdate.executionScore = (user.executionScore || 0) + (points * 0.1)
      scoreUpdate.reliabilityScore = (user.reliabilityScore || 0) + (points * 0.05)
    } else if (source === 'COURSE_FINISHED') {
      scoreUpdate.collaborationScore = (user.collaborationScore || 0) + (points * 0.15)
      scoreUpdate.ethicsScore = (user.ethicsScore || 0) + (points * 0.1)
    } else if (source === 'ACHIEVEMENT_UNLOCKED') {
      scoreUpdate.leadershipScore = (user.leadershipScore || 0) + (points * 0.2)
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        totalPoints: (user.totalPoints || 0) + points,
        ...scoreUpdate,
      },
    })

    // Create point transaction
    const transaction = await db.pointTransaction.create({
      data: {
        userId,
        points,
        source,
        description,
        metadata,
      },
    })

    // Create notification
    await db.notification.create({
      data: {
        userId,
        type: 'INFO',
        title: 'Points Awarded!',
        message: `You earned ${points} points for ${description || source}`,
        priority: 'MEDIUM',
        read: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        transaction,
        newTotal: updatedUser.totalPoints,
        message: `Successfully awarded ${points} points`,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Award points error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to award points',
    }, { status: 500 })
  }
}

// POST /api/points/adjust - Admin adjust points (platform admin only)
export async function ADJUST(request: NextRequest) {
  try {
    // Require platform admin role
    let authResult
    try {
      authResult = await requireRole(request, ['PLATFORM_ADMIN'])
    } catch (error) {
      if (error instanceof AuthError) {
        return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
      }
      if (!authResult) {
        return forbidden('Only platform administrators can adjust points')
      }
      throw error
    }

    const body = await request.json()
    const validatedData = adjustPointsSchema.parse(body)

    const { userId, amount, reason } = validatedData

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { totalPoints: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Adjust points
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        totalPoints: (user.totalPoints || 0) + amount,
      },
    })

    // Create point transaction record
    const transaction = await db.pointTransaction.create({
      data: {
        userId,
        points: amount,
        source: 'POINTS_ADJUSTMENT',
        description: reason,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        transaction,
        newTotal: updatedUser.totalPoints,
        message: `Points adjusted by ${amount}`,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Adjust points error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to adjust points',
    }, { status: 500 })
  }
}
