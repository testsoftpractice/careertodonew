import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/mentors - Get available mentors
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

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get potential mentors (users with MENTOR role or high scores)
    const potentialMentors = await db.user.findMany({
      where: {
        role: { in: ['MENTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        executionScore: true,
        collaborationScore: true,
        leadershipScore: true,
        ethicsScore: true,
        reliabilityScore: true
      },
      take: 8
    })

    // Transform to mentor format
    const mentors = potentialMentors.map(user => {
      const avgScore = (
        (user.executionScore +
         user.collaborationScore +
         user.leadershipScore +
         user.ethicsScore +
         user.reliabilityScore) / 5
      )

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        title: user.role === 'MENTOR' ? 'Industry Mentor' : 'Academic Mentor',
        company: 'CareerToDone Network',
        expertise: ['Project Management', 'Career Guidance', 'Technical Skills', 'Leadership'].slice(0, Math.floor(Math.random() * 3) + 1),
        availability: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as any,
        meetingsCount: Math.floor(Math.random() * 10),
        rating: avgScore.toFixed(1)
      }
    })

    return NextResponse.json({
      success: true,
      data: mentors
    })
  } catch (error: any) {
    console.error('Get mentors error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  }
}
