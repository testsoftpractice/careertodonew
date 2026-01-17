import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || null
    const university = searchParams.get('university') || null
    const limit = parseInt(searchParams.get('limit') || '50')

    const orderBy: any = category ? { rating: { _avg: { [category]: 'desc' } } } : { reputation: 'desc' }

    const where: any = {}
    
    if (category) {
      where.rating = { _avg: { [category]: { gt: 0 } } }
    }
    
    if (university) {
      where.user = { university: { name: { contains: university, mode: 'insensitive' } } }
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        take: limit,
        orderBy,
      }),
      db.user.count({ where }),
    ])

    const usersWithRankings = users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      university: u.university?.name || '',
      major: u.major || '',
      graduationYear: u.graduationYear || null,
      overallReputation: u.reputation || 0,
      breakdown: {
        execution: 4.5,
        collaboration: 4.5,
        leadership: 3.5,
        ethics: 4.5,
        reliability: 5.0,
      },
      projectCount: 0,
      achievementCount: 0,
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
