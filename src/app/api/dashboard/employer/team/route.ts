import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, errorResponse } from '@/lib/api-response'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/team - Get employer's team performance
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const user = authResult.user

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
      ? users.reduce((sum, u) => sum + (((u.executionScore || 0) + (u.collaborationScore || 0) + (u.leadershipScore || 0) + (u.ethicsScore || 0) + (u.reliabilityScore || 0)) / 5), 0) / users.length
      : 0

    const activeProjects = await db.project.count({
      where: {
        ownerId: { in: users.map(u => u.id) },
        status: 'IN_PROGRESS'
      }
    })

    // Transform to team member format
    const teamMembers = users.map(user => {
      const performance = (((user.executionScore || 0) + (u.collaborationScore || 0) + (u.leadershipScore || 0) + (u.ethicsScore || 0) + (u.reliabilityScore || 0)) / 5) * 10

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        department: 'General',
        projects: 0,
        performance: performance.toFixed(1),
        hireDate: user.createdAt,
        status: 'active'
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
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get team performance error:', error)
    return errorResponse('Failed to fetch team performance', 500)
  }
}
