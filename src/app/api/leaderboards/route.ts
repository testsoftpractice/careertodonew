import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || null
    const university = searchParams.get('university') || null
    const limit = parseInt(searchParams.get('limit') || '50')

    // Use totalPoints for ranking since it exists in the User model
    const orderBy: any = { totalPoints: 'desc' }

    const where: any = {
      role: 'STUDENT', // Only show students in leaderboard
    }

    if (university) {
      where.University = { name: { contains: university, mode: 'insensitive' } }
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        take: limit,
        orderBy,
        include: {
          University: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ])

    const usersWithRankings = users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      university: u.University?.name || '',
      major: u.major || '',
      graduationYear: u.graduationYear || null,
      overallReputation: u.totalPoints || 0,
      breakdown: {
        execution: u.executionScore || 0,
        collaboration: u.collaborationScore || 0,
        leadership: u.leadershipScore || 0,
        ethics: u.ethicsScore || 0,
        reliability: u.reliabilityScore || 0,
      },
      projectCount: 0, // Would need to count projects separately if needed
      achievementCount: 0, // Would need to count achievements separately if needed
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithRankings,
        totalCount,
        currentPage: 1,
        totalPages: Math.ceil(totalCount / limit),
        category,
        university,
      },
    })
  } catch (error: any) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
