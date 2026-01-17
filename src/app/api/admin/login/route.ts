import { NextRequest, NextResponse } from 'next/server'

// Generate admin JWT token
const generateAdminToken = (user: any) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: 'ADMIN',
  }

  const secret = process.env.JWT_SECRET || 'admin-secret-key-for-development-only'
  const token = Buffer.from(JSON.stringify(payload)).toString('base64')

  return { token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }
}

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

    // Check if it's admin account
    // For demo purposes, accept any email with 'admin' or specific admin credentials
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('admin@')
    
    // Mock admin user (in production, fetch from database)
    const adminUser = {
      id: 'admin-001',
      email: email.toLowerCase(),
      role: 'ADMIN',
      name: 'Platform Admin',
    }

    // Verify password (in production, use bcrypt.compare())
    const passwordMatch = password === 'adminpassword123' // TODO: Replace with bcrypt.compare()

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate admin token
    const { token, expiresAt } = generateAdminToken(adminUser)

    // Log login
    console.log('Admin login:', email)

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      user: adminUser,
      token,
      expiresAt,
    })
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

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
