import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authRateLimit } from '@/lib/rate-limiter'

// GET /api/admin/payment-verifications/[id] - Get payment verification details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[PAYMENT_VERIFICATION_GET] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { id: userId } = await params

    // Get user with payment details
    const user = await db.user.findUnique({
      where: { id: userId },
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
        University: {
          select: {
            name: true,
          },
        },
        major: true,
        graduationYear: true,
        createdAt: true,
      },
    })

    if (!user) {
      console.log('[PAYMENT_VERIFICATION_GET] ERROR: User not found')
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('[PAYMENT_VERIFICATION_GET] User found:', user.id)
    console.log('[PAYMENT_VERIFICATION_GET] =============== SUCCESS ===============')

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[PAYMENT_VERIFICATION_GET] =============== ERROR ===============')
    console.error('[PAYMENT_VERIFICATION_GET] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[PAYMENT_VERIFICATION_GET] =============== ERROR ===============')

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

// PATCH /api/admin/payment-verifications/[id] - Approve or reject payment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[PAYMENT_VERIFICATION_PATCH] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await request.json()
    console.log('[PAYMENT_VERIFICATION_PATCH] Received body:', JSON.stringify(body, null, 2))

    const { action, adminId } = body
    const { id: userId } = await params

    // Validate action
    if (!action || !['approve', 'reject'].includes(action)) {
      console.log('[PAYMENT_VERIFICATION_PATCH] ERROR: Invalid action')
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      console.log('[PAYMENT_VERIFICATION_PATCH] ERROR: User not found')
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has a transaction ID
    if (!user.transactionId) {
      console.log('[PAYMENT_VERIFICATION_PATCH] ERROR: No transaction ID found')
      return NextResponse.json(
        { success: false, error: 'No transaction ID found for this user' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.paymentVerified) {
      console.log('[PAYMENT_VERIFICATION_PATCH] ERROR: Payment already verified')
      return NextResponse.json(
        { success: false, error: 'Payment has already been verified' },
        { status: 400 }
      )
    }

    // Update user based on action
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        paymentVerified: action === 'approve',
        paymentVerifiedAt: new Date(),
        paymentVerifiedBy: adminId,
        verificationStatus: action === 'approve' ? 'VERIFIED' : 'REJECTED',
        transactionId: action === 'reject' ? null : user.transactionId, // Clear transaction ID on rejection
      },
    })

    console.log('[PAYMENT_VERIFICATION_PATCH] Payment', action, 'for user:', userId)
    console.log('[PAYMENT_VERIFICATION_PATCH] =============== SUCCESS ===============')

    return NextResponse.json(
      {
        success: true,
        message: `Payment ${action}d successfully`,
        data: {
          userId: updatedUser.id,
          paymentVerified: updatedUser.paymentVerified,
          verificationStatus: updatedUser.verificationStatus,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[PAYMENT_VERIFICATION_PATCH] =============== ERROR ===============')
    console.error('[PAYMENT_VERIFICATION_PATCH] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[PAYMENT_VERIFICATION_PATCH] =============== ERROR ===============')

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
