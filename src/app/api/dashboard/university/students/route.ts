import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'

// GET /api/dashboard/university/students - Get student insights
export async function GET(request: NextRequest, context: any) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const searchParams = await context.searchParams
  const sort = (searchParams.sort as string) || 'createdAt'
  const filter = (searchParams.filter as string) || 'active'
  const search = (searchParams.search as string) || ''
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Mock student data - in production, would query from DB with filters
    const students = [
      {
        studentId: '1',
        studentName: 'Sarah Johnson',
        universityId,
        department: 'Engineering',
        yearLevel: 'Senior',
        major: 'Computer Science',
        concentration: 'Artificial Intelligence',
        totalXP: 1250,
        averageXP: 125,
        rank: 1,
        totalProjects: 8,
        activeProjects: 3,
        completedProjects: 4,
        firstProjectDate: new Date('2024-09-01'),
        lastActiveDate: new Date(),
        engagementScore: 85,
        participationRate: 92,
      },
      {
        studentId: '2',
        studentName: 'Michael Chen',
        universityId,
        department: 'Engineering',
        yearLevel: 'Junior',
        major: 'Computer Science',
        concentration: 'Web Development',
        totalXP: 980,
        averageXP: 98,
        rank: 2,
        totalProjects: 5,
        activeProjects: 2,
        completedProjects: 2,
        firstProjectDate: new Date('2024-10-01'),
        lastActiveDate: new Date(),
        engagementScore: 78,
        participationRate: 85,
      },
      {
        studentId: '3',
        studentName: 'Emily Davis',
        universityId,
        department: 'Business',
        yearLevel: 'Senior',
        major: 'Business Administration',
        concentration: 'Marketing',
        totalXP: 1100,
        averageXP: 110,
        rank: 1,
        totalProjects: 12,
        activeProjects: 5,
        completedProjects: 6,
        firstProjectDate: new Date('2024-08-15'),
        lastActiveDate: new Date(),
        engagementScore: 90,
        participationRate: 95,
      },
    ]

    // Apply filters
    let filteredStudents = [...students]
    if (filter === 'active') {
      filteredStudents = filteredStudents.filter(s => s.activeProjects > 0)
    } else if (filter === 'completed') {
      filteredStudents = filteredStudents.filter(s => s.completedProjects > 0)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredStudents = filteredStudents.filter(s =>
        s.studentName.toLowerCase().includes(searchLower) ||
        s.department.toLowerCase().includes(searchLower) ||
        s.major.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    if (sort === 'xp') {
      filteredStudents.sort((a, b) => b.totalXP - a.totalXP)
    } else if (sort === 'rank') {
      filteredStudents.sort((a, b) => a.rank - b.rank)
    }

    return NextResponse.json({
      success: true,
      data: {
        students: filteredStudents,
        total: filteredStudents.length,
      },
    })
  } catch (error) {
    console.error('Get university students error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
