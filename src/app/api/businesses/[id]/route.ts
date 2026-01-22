import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/utils/error-handler'

// Helper: Check if user has role in business
async function getUserBusinessRole(userId: string, businessId: string) {
  const business = await db.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  })

  if (!business) return null

  // Owner has OWNER role
  if (business.ownerId === userId) {
    return 'OWNER'
  }

  // Check member roles
  const member = await db.businessMember.findUnique({
    where: {
      businessId_userId: {
        businessId,
        userId,
      },
    },
    select: { role: true },
  })

  return member?.role || null
}

// Helper: Check if user can manage business
async function canManageBusiness(userId: string, businessId: string, requiredRoles: string[] = ['OWNER', 'ADMIN']): Promise<boolean> {
  const userRole = await getUserBusinessRole(userId, businessId)

  if (!userRole) return false

  // Owner can do everything
  if (userRole === 'OWNER') return true

  // Check if user's role meets requirements
  const roleHierarchy = {
    OWNER: 5,
    ADMIN: 4,
    HR_MANAGER: 3,
    PROJECT_MANAGER: 3,
    TEAM_LEAD: 2,
    RECRUITER: 2,
    TEAM_MEMBER: 1,
    VIEWER: 0,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = Math.max(...requiredRoles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0))

  return userLevel >= requiredLevel
}

// GET /api/businesses/[id] - Get business details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id

    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    let userId: string | null = null
    let userRole: string | null = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded && decoded.userId) {
        userId = decoded.userId
        userRole = decoded.role
      }
    }

    // Get business
    const business = await db.business.findUnique({
      where: { id: businessId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
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
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            _count: {
              select: { members: true, tasks: true },
            },
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            type: true,
            published: true,
            _count: {
              select: { applications: true },
            },
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            members: true,
            projects: true,
            jobs: true,
          },
        },
      },
    })

    if (!business) {
      throw new NotFoundError('Business not found')
    }

    // Get user's role in this business
    const myRole = userId ? await getUserBusinessRole(userId, businessId) : null

    // Filter sensitive data based on access
    if (!myRole && business.status !== 'VERIFIED') {
      throw new ForbiddenError('Access denied')
    }

    return NextResponse.json({
      success: true,
      data: {
        ...business,
        myRole,
      },
    })
  } catch (error: any) {
    logError(error, 'Get business', params.id)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch business',
    }, { status: 500 })
  }
}

// PATCH /api/businesses/[id] - Update business
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let userId: string | null = null
  try {
    const businessId = params.id

    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId

    // Ensure userId is set
    if (!userId) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Authorization - Check if user can manage this business
    const canManage = await canManageBusiness(userId, businessId, ['OWNER', 'ADMIN'])

    if (!canManage) {
      throw new ForbiddenError('Insufficient permissions to manage this business')
    }

    const body = await request.json()

    // Update business
    const business = await db.business.update({
      where: { id: businessId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.industry && { industry: body.industry }),
        ...(body.location && { location: body.location }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.logo !== undefined && { logo: body.logo }),
        ...(body.size && { size: body.size }),
        // Only platform admin can change status
        ...(decoded.role === 'PLATFORM_ADMIN' && body.status && { status: body.status }),
        ...(decoded.role === 'PLATFORM_ADMIN' && body.verifiedAt && { verifiedAt: new Date(body.verifiedAt) }),
      },
      include: {
        owner: {
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
      message: 'Business updated successfully',
    })
  } catch (error: any) {
    logError(error, 'Update business', params.id)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update business',
    }, { status: 500 })
  }
}

// DELETE /api/businesses/[id] - Delete business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let userId: string | null = null
  try {
    const businessId = params.id

    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId

    // Authorization - Only owner or platform admin can delete
    const canDelete = await canManageBusiness(userId, businessId, ['OWNER'])

    if (!canDelete && decoded.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('Only business owner or platform admin can delete business')
    }

    // Delete business (cascade will handle related records)
    await db.business.delete({
      where: { id: businessId },
    })

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully',
    })
  } catch (error: any) {
    logError(error, 'Delete business', params.id)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete business',
    }, { status: 500 })
  }
}
