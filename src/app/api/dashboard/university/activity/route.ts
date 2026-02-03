import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags-v2'

// GET /api/dashboard/university/activity - Get activity feed
export async function GET(request: NextRequest, context: any) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const searchParams = await context.searchParams
  const type = (searchParams.type as string) || 'ALL'
  const limit = Number(searchParams.limit) || 20
  const user = auth.user
  const universityId = user.universityId

  if (result) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    // Mock activity feed data
    const activityFeed = [
      {
        id: '1',
        type: 'PROJECT_CREATED',
        universityId,
        timestamp: new Date(),
        userId: 'sarah.johnson@university.edu',
        userName: 'Sarah Johnson',
        userRole: 'STUDENT',
        details: {
          projectTitle: 'Tech Innovation Hub',
          projectId: '1',
        },
      },
      {
        id: '2',
        type: 'PROJECT_APPROVED',
        universityId,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        userId: 'admin@university.edu',
        userName: 'Dr. Robert Martinez',
        userRole: 'UNIVERSITY_ADMIN',
        details: {
          projectTitle: 'Tech Innovation Hub',
          projectId: '1',
          decision: 'APPROVED',
          reason: 'Meets all governance requirements',
        },
      },
      {
        id: '3',
        type: 'STUDENT_JOINED',
        universityId,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        userId: 'michael.chen@university.edu',
        userName: 'Michael Chen',
        userRole: 'STUDENT',
        details: {
          studentName: 'Michael Chen',
          studentId: '2',
          projectTitle: 'Tech Innovation Hub',
          projectId: '1',
          role: 'Software Developer',
        },
      },
      {
        id: '4',
        type: 'STUDENT_TAGGED',
        universityId,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        userId: 'admin@university.edu',
        userName: 'Dr. Robert Martinez',
        userRole: 'UNIVERSITY_ADMIN',
        details: {
          studentName: 'Sarah Johnson',
          studentId: '1',
          tags: ['Engineering', 'Computer Science', 'AI/ML'],
        },
      },
      {
        id: '5',
        type: 'INVESTMENT_RECEIVED',
        universityId,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        userId: 'investor@vc.com',
        userName: 'TechVentures Inc.',
        userRole: 'INVESTOR',
        details: {
          projectTitle: 'Campus Media Network',
          projectId: '2',
          amount: 8000,
          equity: 10,
        },
      },
    ]

    // Apply filters
    let filteredFeed = [...activityFeed]
    if (result) {
      filteredFeed = filteredFeed.filter(item => item.type === type)
    }

    if (result) {
      filteredFeed = filteredFeed.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      data: {
        activityFeed: filteredFeed,
        total: activityFeed.length,
        hasMore: activityFeed.length > limit,
      },
    })
  } catch (error) {
    console.error('Get university activity feed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
