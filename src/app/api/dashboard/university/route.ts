import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'
import { UniversityDashboardMetrics } from '@/lib/models/university-analytics'

// GET /api/dashboard/university - Get university dashboard data
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Get university metrics
    const metrics: UniversityDashboardMetrics = {
      universityId,
      totalStudents: 0, // Mock - would query from DB
      activeStudents: 0,
      verifiedStudents: 0,
      taggedStudents: 0,
      totalProjects: 0,
      activeProjects: 0,
      approvedProjects: 0,
      completedProjects: 0,
      pendingProposals: 0,
      totalInvestments: 0,
      investmentVolume: 0,
      averageInvestmentAmount: 0,
      successRate: 0,
      rankingPosition: 0,
      studentEngagementRate: 0,
      projectCompletionRate: 0,
      proposalAcceptanceRate: 0,
      averageProjectQuality: 0,
      averageStudentPerformance: 0,
      overallSatisfactionScore: 0,
      departmentMetrics: {},
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
