import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, AuthError } from '@/lib/auth/verify'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/verification-requests - Get verification requests for an employer
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return errorResponse('Authentication required', 401)
    }

    const { searchParams } = new URL(request.url)
    const requesterId = searchParams.get('requesterId')

    if (!requesterId) {
      return errorResponse('Requester ID is required', 400)
    }

    const requests = await db.verificationRequest.findMany({
      where: {
        requesterId
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: 50,
    })

    return successResponse(requests, 'Verification requests fetched successfully')
  } catch (error: any) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get verification requests error:', error)
    return errorResponse('Failed to fetch verification requests', 500)
  }
}
