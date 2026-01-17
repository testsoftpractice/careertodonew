import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'

// GET /api/dashboard/university/projects - Get project insights
export async function GET(request: NextRequest, context: any) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const searchParams = await context.searchParams
  const status = (searchParams.status as string) || 'active'
  const department = (searchParams.department as string) || ''
  const search = (searchParams.search as string) || ''
  const user = auth.user
  const universityId = user.universityId

  if (!universityId) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Mock project data
    const projects = [
      {
        projectId: '1',
        projectTitle: 'Tech Innovation Hub',
        universityId,
        projectLead: 'Sarah Johnson',
        category: 'Startup',
        status: 'active',
        totalMembers: 12,
        activeMembers: 10,
        totalTasks: 45,
        completedTasks: 35,
        taskCompletionRate: 78,
        qualityScore: 85,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        durationDays: 120,
        fundingAmount: 15000,
        investorCount: 2,
        department: 'Engineering',
      },
      {
        projectId: '2',
        projectTitle: 'Campus Media Network',
        universityId,
        projectLead: 'Michael Chen',
        category: 'News & Media',
        status: 'completed',
        totalMembers: 8,
        activeMembers: 0,
        totalTasks: 30,
        completedTasks: 30,
        taskCompletionRate: 100,
        qualityScore: 92,
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-11-30'),
        durationDays: 75,
        fundingAmount: 8000,
        investorCount: 1,
        department: 'Arts & Humanities',
      },
      {
        projectId: '3',
        projectTitle: 'Financial Services Platform',
        universityId,
        projectLead: 'Emily Davis',
        category: 'Consulting',
        status: 'active',
        totalMembers: 6,
        activeMembers: 5,
        totalTasks: 25,
        completedTasks: 18,
        taskCompletionRate: 72,
        qualityScore: 88,
        startDate: new Date('2024-10-01'),
        endDate: new Date(),
        durationDays: 60,
        fundingAmount: 5000,
        investorCount: 0,
        department: 'Business',
      },
    ]

    // Apply filters
    let filteredProjects = [...projects]
    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status)
    }

    if (department) {
      filteredProjects = filteredProjects.filter(p => p.department === department)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProjects = filteredProjects.filter(p =>
        p.projectTitle.toLowerCase().includes(searchLower) ||
        p.projectLead.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        projects: filteredProjects,
        total: filteredProjects.length,
        departments: [...new Set(projects.map(p => p.department))],
        statuses: [...new Set(projects.map(p => p.status))],
      },
    })
  } catch (error) {
    console.error('Get university projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
