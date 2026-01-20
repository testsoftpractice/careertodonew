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

// Helper: Check role hierarchy
function hasHigherRoleOrEqual(userRole: string, targetRole: string): boolean {
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
  const targetLevel = roleHierarchy[targetRole as keyof typeof roleHierarchy] || 0

  return userLevel >= targetLevel
}

// GET /api/businesses/[id]/members/[memberId] - Get specific member details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id: businessId, memberId } = params

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

    const userId = decoded.userId

    // Check if user has access to this business
    const userRole = await getUserBusinessRole(userId, businessId)

    if (!userRole && decoded.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('You are not a member of this business')
    }

    // Get member
    const member = await db.businessMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!member || member.businessId !== businessId) {
      throw new NotFoundError('Member not found')
    }

    // Parse permissions
    const parsedMember = {
      ...member,
      permissions: member.permissions ? JSON.parse(member.permissions) : {},
    }

    return NextResponse.json({
      success: true,
      data: parsedMember,
    })
  } catch (error: any) {
    logError(error, 'Get business member', params.memberId)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch member',
    }, { status: 500 })
  }
}

// PATCH /api/businesses/[id]/members/[memberId] - Update member role/permissions
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  let userId: string | null = null
  try {
    const { id: businessId, memberId } = params

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

    // Get current member and their role
    const targetMember = await db.businessMember.findUnique({
      where: { id: memberId },
      include: {
        business: {
          select: { ownerId: true },
        },
      },
    })

    if (!targetMember || targetMember.businessId !== businessId) {
      throw new NotFoundError('Member not found')
    }

    // Get requester's role
    const userRole = await getUserBusinessRole(userId, businessId)

    // Authorization checks
    // Can't modify owner through this endpoint
    if (targetMember.business.ownerId === targetMember.userId) {
      throw new ForbiddenError('Cannot modify business owner role')
    }

    // Check if requester has sufficient permissions
    const canModify = ['OWNER', 'ADMIN', 'HR_MANAGER'].includes(userRole || '')

    if (!canModify && decoded.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('Insufficient permissions to modify member')
    }

    const body = await request.json()

    // Check if assigning new role is allowed
    if (body.role && !hasHigherRoleOrEqual(userRole || 'VIEWER', body.role)) {
      throw new ForbiddenError('Cannot assign a role higher than your own')
    }

    // Update member
    const member = await db.businessMember.update({
      where: { id: memberId },
      data: {
        ...(body.role && { role: body.role }),
        ...(body.permissions !== undefined && {
          permissions: body.permissions ? JSON.stringify(body.permissions) : null,
        }),
      },
      include: {
        user: {
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
      data: {
        ...member,
        permissions: member.permissions ? JSON.parse(member.permissions) : {},
      },
      message: `Member updated successfully`,
    })
  } catch (error: any) {
    logError(error, 'Update business member', params.memberId)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update member',
    }, { status: 500 })
  }
}

// DELETE /api/businesses/[id]/members/[memberId] - Remove member from business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  let userId: string | null = null
  try {
    const { id: businessId, memberId } = params

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

    // Get target member
    const targetMember = await db.businessMember.findUnique({
      where: { id: memberId },
      include: {
        business: {
          select: { ownerId: true },
        },
      },
    })

    if (!targetMember || targetMember.businessId !== businessId) {
      throw new NotFoundError('Member not found')
    }

    // Get requester's role
    const userRole = await getUserBusinessRole(userId, businessId)

    // Can't remove business owner through this endpoint
    if (targetMember.business.ownerId === targetMember.userId) {
      throw new ForbiddenError('Cannot remove business owner')
    }

    // User can remove themselves
    if (targetMember.userId === userId) {
      await db.businessMember.delete({
        where: { id: memberId },
      })

      return NextResponse.json({
        success: true,
        message: 'You have left the business',
      })
    }

    // Authorization checks
    const canRemove = ['OWNER', 'ADMIN', 'HR_MANAGER'].includes(userRole || '')

    if (!canRemove && decoded.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('Insufficient permissions to remove member')
    }

    // Check if target member has higher or equal role
    if (!hasHigherRoleOrEqual(userRole || 'VIEWER', targetMember.role)) {
      throw new ForbiddenError('Cannot remove a member with equal or higher role')
    }

    // Remove member
    await db.businessMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    })
  } catch (error: any) {
    logError(error, 'Remove business member', params.memberId)

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to remove member',
    }, { status: 500 })
  }
}
