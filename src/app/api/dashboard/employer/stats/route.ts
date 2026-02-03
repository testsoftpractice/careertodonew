import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/employer/stats - Get employer dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch employer's verification requests
    const allRequests = await db.verificationRequest.findMany({
      where: { requesterId: userId },
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
