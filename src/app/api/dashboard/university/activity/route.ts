import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, UNIVERSITY_DASHBOARD } from '@/lib/features/flags'

// GET /api/dashboard/university/activity - Get activity feed
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(UNIVERSITY_DASHBOARD)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(request.url)
  const type = (searchParams.get('type') as string) || 'ALL'
  const limit = Number(searchParams.get('limit')) || 20
  const user = auth

  const universityId = user.universityId

  if (!universityId) {
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
          amount: 80000,
          equity: 10,
        },
      },
    ]

    // Apply filters
    let filteredFeed = [...activityFeed]
    if (type !== 'ALL') {
      filteredFeed = filteredFeed.filter(item => item.type === type)
    }

    if (type !== 'ALL') {
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
