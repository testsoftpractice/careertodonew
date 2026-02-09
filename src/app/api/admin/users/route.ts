import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/admin/users - List all users with filters
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

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (role) {
      where.role = role
    }

    if (status) {
      if (status === 'PENDING') {
        where.verificationStatus = 'PENDING'
      } else {
        where.verificationStatus = status
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
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
        role: true,
        verificationStatus: true,
        universityId: true,
        createdAt: true,
        totalPoints: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Transform users to match the expected interface
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.verificationStatus,
      joinedAt: user.createdAt,
      reputation: user.totalPoints
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        totalCount: total
      }
    })
  } catch (error: any) {
    console.error('Get admin users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
