import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError, ForbiddenError } from '@/lib/utils/error-handler'

// GET /api/businesses - Get businesses (filtered by user access or public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId') // Owner's businesses

    // Authentication check
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    let authenticatedUserId: string | null = null
    let userRole: string | null = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        authenticatedUserId = decoded.userId
        userRole = decoded.role
      }
    }

    // Build query
    const where: any = {}

    if (!token) {
      where.status = status
    }

    // If requesting specific user's businesses, filter by owner
    if (!token) {
      where.ownerId = userId
    }

    const businesses = await db.business.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        BusinessMember: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: { joinedAt: 'desc' },
        },
        _count: {
          select: {
            BusinessMember: true,
            Project: true,
            Job: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        businesses,
        count: businesses.length,
      },
    })
  } catch (error) {
    console.error('Businesses API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch businesses',
    }, { status: 500 })
  }
}

// POST /api/businesses - Create a new business
export async function POST(request: NextRequest) {
  let userId: string | null = null
  let userRole: string | null = null
  try {
    // Authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId
    userRole = decoded.role

    // Authorization - Only employers and platform admins can create businesses
    if (userRole !== 'EMPLOYER' && userRole !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('Only employers and platform admins can create businesses')
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      throw new AppError('Business name is required', 'VALIDATION_ERROR', 400)
    }

    // Ensure userId is set
    if (!userId) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Create business
    const business = await db.business.create({
      data: {
        name: body.name,
        description: body.description || null,
        industry: body.industry || null,
        location: body.location || null,
        website: body.website || null,
        logo: body.logo || null,
        size: body.size || null,
        ownerId: userId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: business,
      message: 'Business created successfully and pending verification',
    }, { status: 201 })
  } catch (error: any) {
    logError(error, 'Create business', userId || 'unknown')

    if (error.statusCode) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create business',
    }, { status: 500 })
  }
}
