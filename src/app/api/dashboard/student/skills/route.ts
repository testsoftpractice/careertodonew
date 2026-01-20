import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/student/skills - Get student's skills matrix
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

    // Get user's skills
    const skills = await db.skill.findMany({
      where: { userId: decoded.userId },
      orderBy: { level: 'desc' },
      take: 10
    })

    // Transform skills for the widget
    const skillMatrix = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category || 'Technical',
      level: skill.level || 1,
      endorsements: Math.floor(Math.random() * 20), // Mock endorsements
      verified: skill.verified || false,
      projects: Math.floor(Math.random() * 5) // Mock project count
    }))

    const totalSkills = skillMatrix.length
    const totalEndorsements = skillMatrix.reduce((sum, s) => sum + s.endorsements, 0)
    const topSkill = skillMatrix[0]

    return NextResponse.json({
      success: true,
      data: {
        skills: skillMatrix,
        totalSkills,
        totalEndorsements,
        topSkill
      }
    })
  } catch (error: any) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}
