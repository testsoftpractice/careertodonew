import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authRateLimit } from '@/lib/rate-limiter'

// GET /api/admin/payment-verifications - List all payment verifications
export async function GET(request: NextRequest) {
  try {
    console.log('[PAYMENT_VERIFICATIONS_GET] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending' // pending, verified, rejected, all
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      role: 'STUDENT',
      transactionId: { not: null },
    }

    if (status === 'pending') {
      where.paymentVerified = false
      where.verificationStatus = { in: ['UNDER_REVIEW'] }
    } else if (status === 'verified') {
      where.paymentVerified = true
    } else if (status === 'rejected') {
      where.verificationStatus = 'REJECTED'
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { transactionId: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get total count
    const total = await db.user.count({ where })

    // Get users with pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        transactionId: true,
        paymentVerified: true,
        paymentVerifiedAt: true,
        paymentVerifiedBy: true,
        verificationStatus: true,
        role: true,
        university: {
          select: {
            name: true,
          },
        },
        major: true,
        graduationYear: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get verified by user names
    const verifiedByUserIds = users
      .map((u) => u.paymentVerifiedBy)
      .filter((id): id is string => id !== null)

    const verifiedByUsers = await db.user.findMany({
      where: { id: { in: verifiedByUserIds } },
      select: { id: true, name: true },
    })

    const verifiedByMap = new Map(verifiedByUsers.map((u) => [u.id, u.name]))

    // Add verified by name to results
    const usersWithVerifiedByName = users.map((user) => ({
      ...user,
      verifiedByName: user.paymentVerifiedBy ? verifiedByMap.get(user.paymentVerifiedBy) : null,
    }))

    console.log('[PAYMENT_VERIFICATIONS_GET] Found', users.length, 'verifications')
    console.log('[PAYMENT_VERIFICATIONS_GET] =============== SUCCESS ===============')

    return NextResponse.json(
      {
        success: true,
        data: usersWithVerifiedByName,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[PAYMENT_VERIFICATIONS_GET] =============== ERROR ===============')
    console.error('[PAYMENT_VERIFICATIONS_GET] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[PAYMENT_VERIFICATIONS_GET] =============== ERROR ===============')

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
