import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { VerificationStatus } from '@/lib/constants'

// GET /api/admin/verification/users - List users with filters
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

    const decoded = verifyToken(token)

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
      where.verificationStatus = status as VerificationStatus
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
      include: {
        University: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        Business: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Get verification users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/verification/users - Bulk update user verification status
export async function PUT(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userIds, status, reason } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User IDs are required' },
        { status: 400 }
      )
    }

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification status' },
        { status: 400 }
      )
    }

    // Update users
    const updatedUsers = await db.user.updateMany({
      where: {
        id: { in: userIds }
      },
      data: {
        verificationStatus: status as VerificationStatus
      }
    })

    // Create notifications for affected users
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true }
    })

    for (const user of users) {
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'VERIFICATION_STATUS',
          title: `Account Status Changed`,
          message: `Your account status has been updated to ${status}${reason ? `. Reason: ${reason}` : ''}`,
          link: '/dashboard'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        updated: updatedUsers.count,
        status
      }
    })
  } catch (error: any) {
    console.error('Update verification users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update users' },
      { status: 500 }
    )
  }
}
