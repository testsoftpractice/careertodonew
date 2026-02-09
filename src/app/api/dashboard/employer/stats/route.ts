import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/dashboard/employer/stats - Get employer dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Users can only view their own stats unless they are platform admin
    const isAdmin = decoded.role === 'PLATFORM_ADMIN'
    if (!isAdmin && userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only view your own stats' },
        { status: 403 }
      )
    }

    // Default to authenticated user's ID
    const targetUserId = userId || decoded.userId

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch employer's verification requests
    const allRequests = await db.verificationRequest.findMany({
      where: { requesterId: targetUserId },
      orderBy: { submittedAt: 'desc' },
    })

    // Calculate statistics
    const totalRequests = allRequests.length
    const pendingRequests = allRequests.filter(r => r.status === 'PENDING').length
    const verifiedRequests = allRequests.filter(r => r.status === 'VERIFIED').length
    const rejectedRequests = allRequests.filter(r => r.status === 'REJECTED').length

    const stats = {
      totalRequests,
      pendingRequests,
      approvedRequests: verifiedRequests,
      rejectedRequests,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error('Get employer dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
