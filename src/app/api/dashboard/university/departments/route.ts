import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'

// GET /api/dashboard/university/departments - Get department insights
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
    // Mock department data
    const departments = [
      {
        department: 'Engineering',
        category: 'Sciences',
        universityId,
        totalStudents: 450,
        activeStudents: 380,
        taggedStudents: 420,
        xpEarned: 125000,
        averageXP: 278,
        totalProjects: 35,
        activeProjects: 20,
        completedProjects: 12,
        averageProjectQuality: 82,
        averageCompletionTime: 45,
        studentSatisfactionScore: 85,
        departmentRank: 1,
        universityRank: 2,
      },
      {
        department: 'Business',
        category: 'Professional',
        universityId,
        totalStudents: 320,
        activeStudents: 280,
        taggedStudents: 300,
        xpEarned: 89000,
        averageXP: 278,
        totalProjects: 28,
        activeProjects: 15,
        completedProjects: 10,
        averageProjectQuality: 88,
        averageCompletionTime: 38,
        studentSatisfactionScore: 90,
        departmentRank: 2,
        universityRank: 2,
      },
      {
        department: 'Arts & Humanities',
        category: 'Liberal Arts',
        universityId,
        totalStudents: 380,
        activeStudents: 350,
        taggedStudents: 360,
        xpEarned: 68000,
        averageXP: 179,
        totalProjects: 18,
        activeProjects: 12,
        completedProjects: 5,
        averageProjectQuality: 85,
        averageCompletionTime: 52,
        studentSatisfactionScore: 82,
        departmentRank: 3,
        universityRank: 2,
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        departments,
        total: departments.length,
      },
    })
  } catch (error) {
    console.error('Get university departments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
