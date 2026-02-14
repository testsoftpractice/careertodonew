import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'
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

  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const user = auth.user

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const universityId = user.universityId

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
      totalStudents: totalStudents,
      activeStudents: totalStudents, // Using total as active for mock
      verifiedStudents: verifiedStudents,
      taggedStudents: 0, // Would calculate from tags
      totalProjects: totalProjects,
      activeProjects,
      approvedProjects: 0, // Would calculate from project approval status
      completedProjects,
      pendingProposals: pendingStudents,
      totalInvestments: 0, // Would calculate from investment data
      investmentVolume: 0,
      averageInvestmentAmount: 0,
      successRate: 0,
      rankingPosition: 0,
      rankingChange: 0,
      studentEngagementRate: 0, // Would calculate from activity
      projectCompletionRate: totalProjects > 0 ? completedProjects / totalProjects : 0,
      proposalAcceptanceRate: 0,
      averageProjectQuality: 0,
      averageStudentPerformance: 0,
      overallSatisfactionScore: 0,
      departmentMetrics: {},
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
