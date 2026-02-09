import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { z } from 'zod'

// GET /api/dashboard/admin/verifications - Get all pending verifications
export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get pending user verifications
    const pendingUsers = await db.user.findMany({
      where: {
        verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] }
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Get pending business verifications
    const pendingBusinesses = await db.business.findMany({
      where: {
        status: { in: ['PENDING', 'UNDER_REVIEW'] }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Get pending verification requests
    const verificationRequests = await db.verificationRequest.findMany({
      where: {
        status: { in: ['PENDING', 'UNDER_REVIEW'] }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      data: {
        pendingUsers,
        pendingBusinesses,
        verificationRequests,
        total: pendingUsers.length + pendingBusinesses.length + verificationRequests.length
      }
    })
  } catch (error: any) {
    console.error('Get verifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verifications' },
      { status: 500 }
    )
  }
}
