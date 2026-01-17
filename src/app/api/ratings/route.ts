import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RatingDimension, RatingSource } from '@prisma/client'

// GET /api/ratings - List ratings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ratedId = searchParams.get('ratedId')
    const raterId = searchParams.get('raterId')
    const dimension = searchParams.get('dimension')
    const projectId = searchParams.get('projectId')

    const where: any = {}

    if (ratedId) {
      where.ratedId = ratedId
    }

    if (raterId) {
      where.raterId = raterId
    }

    if (dimension) {
      where.dimension = dimension as RatingDimension
    }

    if (projectId) {
      where.projectId = projectId
    }

    const ratings = await db.rating.findMany({
      where,
      include: {
        rater: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        rated: {
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
      raterId,
      ratedId,
      dimension,
      source,
      projectId,
      taskId,
      score,
      comment,
    } = body

    // Validate score is between 1 and 5
    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if rater already rated this person for this dimension and project
    const existingRating = await db.rating.findFirst({
      where: {
        raterId,
        ratedId,
        dimension: dimension as RatingDimension,
        projectId,
      },
    })

    if (existingRating) {
      return NextResponse.json(
        { error: 'You have already rated this user for this dimension in this project' },
        { status: 400 }
      )
    }

    const rating = await db.rating.create({
      data: {
        raterId,
        ratedId,
        dimension: dimension as RatingDimension,
        source: source || RatingSource.PEER,
        projectId,
        taskId,
        score: parseFloat(score),
        comment,
      },
      include: {
        rater: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        rated: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Update user's cached scores
    await updateUserReputationScores(ratedId)

    // Create notification for rated user
    await db.notification.create({
      data: {
        userId: ratedId,
        type: 'RATING_RECEIVED',
        title: 'New Rating Received',
        message: `You received a ${score}-star rating for ${dimension.toLowerCase()}`,
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
    where: { ratedId: userId },
  })

  const calculateAverage = (dimension: RatingDimension) => {
    const dimensionRatings = ratings.filter(r => r.dimension === dimension)
    if (dimensionRatings.length === 0) return 0
    return dimensionRatings.reduce((sum, r) => sum + r.score, 0) / dimensionRatings.length
  }

  const scores = {
    executionScore: calculateAverage(RatingDimension.EXECUTION),
    collaborationScore: calculateAverage(RatingDimension.COLLABORATION),
    leadershipScore: calculateAverage(RatingDimension.LEADERSHIP),
    ethicsScore: calculateAverage(RatingDimension.ETHICS),
    reliabilityScore: calculateAverage(RatingDimension.RELIABILITY),
  }

  await db.user.update({
    where: { id: userId },
    data: scores,
  })
}
