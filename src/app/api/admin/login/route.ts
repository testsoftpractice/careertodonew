import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth/jwt'
import { db } from '@/lib/db'

// POST /api/admin/login - Admin login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find admin user in database
    const adminUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verificationStatus: true,
        password: true,
        avatar: true,
      },
    })

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify role is PLATFORM_ADMIN
    if (adminUser.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Not authorized as admin' },
        { status: 403 }
      )
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, adminUser.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    })

    // Log login
    console.log('Admin login:', email)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = adminUser

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      user: userWithoutPassword,
      token,
    })
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}
