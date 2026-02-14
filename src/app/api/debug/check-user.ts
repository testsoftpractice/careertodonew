import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/verify'

// GET /api/debug/check-user - Check user details (DEV ONLY)
export async function GET(request: NextRequest) {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  // Require authentication and admin role in development
  try {
    const authResult = await requireAuth(request)
    if (authResult.dbUser.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId parameter required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verificationStatus: true,
        universityId: true,
        university: {
          select: {
            id: true,
            name: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error: unknown) {
    console.error('Check user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check user' },
      { status: 500 }
    )
  }
}
