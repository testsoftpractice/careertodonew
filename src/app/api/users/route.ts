import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, AuthError } from '@/lib/auth/verify'
import { errorResponse, forbidden } from '@/lib/api-response'

// GET /api/users - Get users with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')
    const universityId = searchParams.get('universityId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (role) {
      where.role = role
    }

    if (universityId) {
      where.universityId = universityId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const users = await db.user.findMany({
      where,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        universityId: true,
        University: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        major: true,
        graduationYear: true,
        verificationStatus: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get users error:', error)
    return errorResponse('Failed to fetch users', 500)
  }
}
