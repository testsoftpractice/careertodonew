import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/employer/team - Get employer's team performance
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

    // Get team members (users with EMPLOYER role or project members)
    const users = await db.user.findMany({
      where: {
        role: 'EMPLOYER'
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
        reliabilityScore: true,
        createdAt: true
      },
      take: 10
    })

    // Calculate team stats
    const totalMembers = users.length
    const avgPerformance = users.length > 0
      ? users.reduce((sum, u) => sum + ((u.executionScore + u.collaborationScore + u.leadershipScore + u.ethicsScore + u.reliabilityScore) / 5), 0) / users.length
      : 0

    const activeProjects = await db.project.count({
      where: {
        ownerId: { in: users.map(u => u.id) },
        status: 'IN_PROGRESS'
      }
    })

    // Transform to team member format
    const teamMembers = users.map(user => {
      const performance = ((user.executionScore + user.collaborationScore + user.leadershipScore + user.ethicsScore + user.reliabilityScore) / 5) * 10

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        department: user.department || 'General',
        projects: user.projectLeads?.length || 0,
        performance: performance.toFixed(1),
        hireDate: user.createdAt,
        status: user.verificationStatus === 'VERIFIED' ? 'active' : 'inactive'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        members: teamMembers,
        totalMembers,
        avgPerformance,
        activeProjects
      }
    })
  } catch (error: any) {
    console.error('Get team performance error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team performance' },
      { status: 500 }
    )
  }
}
