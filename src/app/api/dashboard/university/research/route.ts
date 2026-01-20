import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/university/research - Get university research projects
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

    // Get university info
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { universityId: true }
    })

    if (!user?.universityId) {
      return NextResponse.json(
        { success: false, error: 'No university associated' },
        { status: 400 }
      )
    }

    // Get projects as research projects
    const projects = await db.project.findMany({
      where: {
        universityId: user.universityId
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Calculate stats
    const totalProjects = projects.length
    const activeFunding = projects
      .filter(p => p.status === 'FUNDING' || p.status === 'IN_PROGRESS')
      .reduce((sum, p) => sum + (p.budget || 0), 0)

    const publicationsCount = Math.floor(Math.random() * 50) // Mock - would need publications model

    // Transform to research projects format
    const researchProjects = projects.map(project => ({
      id: project.id,
      title: project.name,
      principalInvestigator: 'Dr. Researcher',
      department: 'Research Department',
      budget: project.budget || 0,
      spent: project.budget ? project.budget * 0.6 : 0,
      startDate: project.startDate || new Date(),
      endDate: project.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: project.status === 'IN_PROGRESS' ? 'active' as const :
              project.status === 'COMPLETED' ? 'completed' as const :
              'on_hold' as const,
      teamSize: Math.floor(Math.random() * 10) + 2,
      publications: Math.floor(Math.random() * 5),
      progress: project.progress || 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        projects: researchProjects,
        totalProjects,
        activeFunding,
        publicationsCount
      }
    })
  } catch (error: any) {
    console.error('Get research projects error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch research projects' },
      { status: 500 }
    )
  }
}
