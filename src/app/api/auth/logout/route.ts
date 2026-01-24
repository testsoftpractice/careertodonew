import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Logout user by clearing the httpOnly token cookie
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[LOGOUT] =============== START ===============')

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear httpOnly cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Immediate expiry
      path: '/',
    })

    console.log('[LOGOUT] Cookie cleared successfully')
    console.log('[LOGOUT] =============== SUCCESS ===============')

    return response
  } catch (error) {
    console.error('[LOGOUT] =============== ERROR ===============')
    console.error('[LOGOUT] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to logout',
      },
      { status: 500 }
    )
  }
}
