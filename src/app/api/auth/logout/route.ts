import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Create response with instructions to clear client-side storage
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      clearStorage: true, // Flag to tell client to clear localStorage
    })

    // Delete all auth-related cookies
    response.cookies.delete('session')
    response.cookies.delete('token')
    response.cookies.delete('user')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to logout',
      },
      { status: 500 }
    )
  }
}
