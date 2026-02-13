import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RatingType } from '@prisma/client'

// GET /api/ratings - List ratings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toUserId = searchParams.get('toUserId')
    const fromUserId = searchParams.get('fromUserId')
    const type = searchParams.get('type')
    const projectId = searchParams.get('projectId')

    const where: any = {}

    if (toUserId) {
      where.toUserId = toUserId
    }

    if (fromUserId) {
      where.fromUserId = fromUserId
    }

    if (searchParams.size > 0 && type) {
      where.type = type as RatingType
    }

    if (searchParams.size > 0 && projectId) {
      where.projectId = projectId
    }

    const ratings = await db.rating.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({ ratings })
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/ratings - Create a new rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fromUserId,
      toUserId,
      type,
      projectId,
      taskId,
      score,
      comment,
    } = body

    // Validate required fields
    if (!fromUserId || !toUserId || !type || !score) {
      return NextResponse.json(
        { error: 'Missing required fields: fromUserId, toUserId, type, and score are required' },
        { status: 400 }
      )
    }

    // Validate score is between 1 and 5
    const scoreNum = parseFloat(score)
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already rated this person for this type in this project
    const existingRating = await db.rating.findFirst({
      where: {
        fromUserId,
        toUserId,
        type: type as RatingType,
        projectId,
      },
    })

    if (existingRating) {
      // Update existing rating instead of creating new one
      const updatedRating = await db.rating.update({
        where: { id: existingRating.id },
        data: {
          score: scoreNum,
          comment: comment || existingRating.comment,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json(
        {
          message: 'Rating updated successfully',
          rating: updatedRating,
        },
        { status: 200 }
      )
    }

    const rating = await db.rating.create({
      data: {
        fromUserId,
        toUserId,
        type: type as RatingType,
        projectId: projectId || null,
        score: scoreNum,
        comment: comment,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Update user's cached scores
    await updateUserReputationScores(toUserId)

    // Create notification for rated user
    await db.notification.create({
      data: {
        userId: toUserId,
        type: 'PROJECT_UPDATE',
        title: 'New Rating Received',
        message: `You received a ${scoreNum}-star rating for ${type.toLowerCase()}`,
        link: `/dashboard/student?tab=reputation`,
      },
    })

    return NextResponse.json(
      {
        message: 'Rating created successfully',
        rating,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update user's cached reputation scores
async function updateUserReputationScores(userId: string) {
  const ratings = await db.rating.findMany({
    where: { toUserId: userId },
  })

  const calculateAverage = (ratingType: RatingType) => {
    const typeRatings = ratings.filter(r => r.type === ratingType)
    if (typeRatings.length === 0) return 0
    return typeRatings.reduce((sum, r) => sum + r.score, 0) / typeRatings.length
  }

  const scores = {
    executionScore: calculateAverage(RatingType.EXECUTION),
    collaborationScore: calculateAverage(RatingType.COLLABORATION),
    leadershipScore: calculateAverage(RatingType.LEADERSHIP),
    ethicsScore: calculateAverage(RatingType.ETHICS),
    reliabilityScore: calculateAverage(RatingType.RELIABILITY),
  }

  await db.user.update({
    where: { id: userId },
    data: scores,
  })
}
