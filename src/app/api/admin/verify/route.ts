import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/verify - Verify admin token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify token (simplified for development)
    const isValid = token && token.length > 20

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      user: {
        id: 'admin',
        email: 'admin@careertodo.com',
        role: 'ADMIN',
        name: 'Platform Admin',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Verification error' },
      { status: 500 }
    )
  }
}
