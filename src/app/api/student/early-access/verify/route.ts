import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authRateLimit } from '@/lib/rate-limiter'

// POST /api/student/early-access/verify - Verify bKash transaction ID
export async function POST(request: NextRequest) {
  try {
    console.log('[EARLY_ACCESS_VERIFY] =============== START ===============')

    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await request.json()
    console.log('[EARLY_ACCESS_VERIFY] Received body:', JSON.stringify(body, null, 2))

    const { transactionId, userId } = body

    // Validate input
    if (!transactionId || !transactionId.trim()) {
      console.log('[EARLY_ACCESS_VERIFY] ERROR: Transaction ID is required')
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Get user from token (if userId not provided in body)
    let finalUserId = userId

    if (!finalUserId) {
      // Try to get user from cookie
      const token = request.cookies.get('token')?.value
      if (!token) {
        console.log('[EARLY_ACCESS_VERIFY] ERROR: No token found')
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // You may need to verify the token here if you have a verifyToken function
      // For now, we'll assume userId is provided
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: finalUserId },
    })

    if (!user) {
      console.log('[EARLY_ACCESS_VERIFY] ERROR: User not found')
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is a student
    if (user.role !== 'STUDENT') {
      console.log('[EARLY_ACCESS_VERIFY] ERROR: User is not a student')
      return NextResponse.json(
        { success: false, error: 'This feature is only available for students' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Verify the transaction with bKash API
    // 2. Check if the amount matches (৳2,999)
    // 3. Check if the transaction hasn't been used before
    // For now, we'll store the transaction ID and change status to UNDER_REVIEW

    // Check if transaction ID is already used
    const existingTransaction = await db.user.findFirst({
      where: { transactionId: transactionId.trim() }
    })

    if (existingTransaction) {
      console.log('[EARLY_ACCESS_VERIFY] ERROR: Transaction ID already used')
      return NextResponse.json(
        { success: false, error: 'This Transaction ID has already been used' },
        { status: 400 }
      )
    }

    // Update user with transaction ID and change verification status to UNDER_REVIEW
    const updatedUser = await db.user.update({
      where: { id: finalUserId },
      data: {
        transactionId: transactionId.trim(),
        verificationStatus: 'UNDER_REVIEW',
      },
    })

    console.log('[EARLY_ACCESS_VERIFY] Transaction ID saved:', transactionId)
    console.log('[EARLY_ACCESS_VERIFY] User updated:', updatedUser.id)
    console.log('[EARLY_ACCESS_VERIFY] =============== SUCCESS ===============')

    return NextResponse.json(
      {
        success: true,
        message: 'Transaction ID submitted successfully. Your payment is being verified.',
        data: {
          userId: updatedUser.id,
          transactionId: transactionId.trim(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[EARLY_ACCESS_VERIFY] =============== ERROR ===============')
    console.error('[EARLY_ACCESS_VERIFY] Error type:', error?.constructor?.name)
    console.error('[EARLY_ACCESS_VERIFY] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[EARLY_ACCESS_VERIFY] =============== ERROR ===============')

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
