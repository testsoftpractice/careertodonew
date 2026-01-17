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
      orderBy: { createdAt: 'desc' },
    })

    // Calculate statistics
    const totalRequests = allRequests.length
    const pendingRequests = allRequests.filter(r => r.status === 'PENDING').length
    const approvedRequests = allRequests.filter(r => r.status === 'APPROVED').length
    const rejectedRequests = allRequests.filter(r => r.status === 'REJECTED').length
    const expiredRequests = allRequests.filter(r => r.status === 'EXPIRED').length

    // Calculate average employer rating (from completed verifications)
    const ratedRequests = allRequests.filter(r => r.employerRating !== null)
    const averageRating =
      ratedRequests.length > 0
        ? ratedRequests.reduce((sum, r) => sum + (r.employerRating || 0), 0) / ratedRequests.length
        : 0

    // Calculate total hires (approved requests with employer ratings)
    const totalHires = allRequests.filter(
      r => r.status === 'APPROVED' && r.employerRating !== null
    ).length

    const stats = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      expiredRequests,
      totalHires,
      averageRating: parseFloat(averageRating.toFixed(2)),
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
