import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

interface ContentReport {
  id: string
  type: string
  title: string
  reporter: string
  status: string
  contentId: string
  reportedDate: string
}

// GET /api/admin/content - Get reported content
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

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    // For now, return mock data matching the frontend expectations
    // In production, this would query from a ContentReport model in the database
    const mockContent: ContentReport[] = [
      {
        id: '1',
        type: 'inappropriate',
        title: 'Offensive language in project description',
        reporter: 'user@careertodo.com',
        status: 'pending',
        contentId: 'p1',
        reportedDate: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'spam',
        title: 'Multiple duplicate project submissions',
        reporter: 'admin@careertodo.com',
        status: 'pending',
        contentId: 'p2',
        reportedDate: new Date().toISOString(),
      },
    ]

    const filteredContent = mockContent.filter(item => {
      if (status && item.status !== status) return false
      if (type && item.type !== type) return false
      return true
    })

    return NextResponse.json({
      success: true,
      data: {
        content: filteredContent.slice(0, limit),
        totalCount: mockContent.length,
      },
    })
  } catch (error: any) {
    console.error('Get content reports error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content reports' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/content - Update content status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, action, reason } = body

    // Validate action
    const validActions = ['approved', 'rejected', 'removed']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be approved, rejected, or removed' },
        { status: 400 }
      )
    }

    // In production, update the content report in database
    // For now, return success
    return NextResponse.json({
      success: true,
      message: `Content ${action} successfully`,
      data: {
        id,
        action,
        reason: reason || '',
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Update content status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content status' },
      { status: 500 }
    )
  }
}
