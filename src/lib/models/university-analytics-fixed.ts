import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD, INVESTOR_DASHBOARD } from '@/lib/features/flags-v2'
import { UniversityDashboardMetrics } from '@/lib/models/university-analytics'

/**
 * University Dashboard API
 * Provides metrics, statistics, and analytics for university administrators
 */

// GET /api/dashboard/university - Get university dashboard data
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const universityId = user.universityId

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Get university details
    const university = await db.university.findUnique({
      where: { id: universityId },
      include: {
        _count: {
          select: { users: true, projects: true }
        }
      },
    })

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    // Get student statistics
    const students = await db.user.findMany({
      where: {
        universityId,
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        major: true,
        role: true,
        verificationStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const totalStudents = students.length
    const verifiedStudents = students.filter(s => s.verificationStatus === 'VERIFIED').length
    const pendingStudents = students.filter(s => s.verificationStatus === 'PENDING').length

    // Get project statistics
    const projects = await db.project.findMany({
      where: {
        ownerId: user.id
      },
      include: {
        _count: {
          select: { members: true, tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length

    // Calculate metrics
    const metrics: UniversityDashboardMetrics = {
      universityId,
      totalStudents: university.totalStudents || 0,
      activeStudents: university.activeStudents || 0,
      verifiedStudents: university.verifiedStudents || 0,
      pendingStudents: university.pendingStudents || 0,
      totalProjects: totalProjects,
      activeProjects,
      completedProjects,
      studentEngagementRate: 0, // Would calculate from activity
      projectCompletionRate: 0, // Would calculate from task data
      overallSatisfactionScore: 0, // Would calculate from surveys
      lastUpdated: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: { metrics },
    })
  } catch (error) {
    console.error('Get university dashboard metrics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
