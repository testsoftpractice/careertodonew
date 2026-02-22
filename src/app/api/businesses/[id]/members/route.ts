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
  if (userId === business.ownerId) {
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

// GET /api/businesses/[id]/members - Get all members of a business
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId: string | undefined
  try {
    const paramsData = await params
    businessId = paramsData.id

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

    const userId = decoded.userId

    // Check if user has access to this business
    const userRole = await getUserBusinessRole(userId, businessId)

    if (!userRole) {
      throw new ForbiddenError('You are not a member of this business')
    }

    // Get members
    const members = await db.businessMember.findMany({
      where: { businessId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
            University: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length,
    })
  } catch (error: any) {
    logError(error, 'Get business members', businessId || 'unknown')

    if (error.statusCode) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch business members',
    }, { status: 500 })
  }
}

// POST /api/businesses/[id]/members - Add a member to a business
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let userId: string | null = null
  let businessId: string | undefined
  try {
    const paramsData = await params
    businessId = paramsData.id

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

    // Ensure userId is set
    if (!userId) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Authorization - Only OWNER, ADMIN, HR_MANAGER, or RECRUITER can add members
    const userRole = await getUserBusinessRole(userId, businessId)

    const canAddMembers = ['OWNER', 'ADMIN', 'HR_MANAGER', 'RECRUITER'].includes(userRole || '')

    if (!canAddMembers) {
      throw new ForbiddenError('Insufficient permissions to add members')
    }

    const body = await request.json()

    // Validate required fields
    if (!body.userId || !body.role) {
      throw new AppError('userId and role are required', 'VALIDATION_ERROR', 400)
    }

    // Check if user exists
    const targetUser = await db.user.findUnique({
      where: { id: body.userId },
      select: { id: true, name: true, email: true },
    })

    if (!targetUser) {
      throw new NotFoundError('User not found')
    }

    // Check if user is already a member
    const existingMember = await db.businessMember.findUnique({
      where: {
        businessId_userId: {
          businessId,
          userId: body.userId,
        },
      },
    })

    if (existingMember) {
      throw new AppError('User is already a member of this business', 'DUPLICATE_MEMBER', 400)
    }

    // Check if assigning role is allowed (can only assign lower or equal roles)
    if (!hasHigherRoleOrEqual(userRole || 'VIEWER', body.role)) {
      throw new ForbiddenError('Cannot assign a role higher than your own')
    }

    // Add member
    const member = await db.businessMember.create({
      data: {
        businessId,
        userId: body.userId,
        role: body.role,
        permissions: body.permissions ? JSON.stringify(body.permissions) : null,
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
      data: member,
      message: `${targetUser.name} added to business as ${body.role}`,
    }, { status: 201 })
  } catch (error: any) {
    logError(error, 'Add business member', businessId || 'unknown')

    if (error.statusCode) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to add member',
    }, { status: 500 })
  }
}

// PATCH /api/businesses/[id]/members - Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let userId: string | null = null
  let businessId: string | undefined
  try {
    const paramsData = await params
    businessId = paramsData.id

    const requestBody = await request.json()
    const { memberId } = requestBody

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

    if (!userId) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Authorization - Check if user can update this member
    const userRole = await getUserBusinessRole(userId, businessId)

    if (!userRole) {
      throw new ForbiddenError('You are not a member of this business')
    }

    const canUpdateMembers = ['OWNER', 'ADMIN', 'HR_MANAGER'].includes(userRole || '')

    if (!canUpdateMembers) {
      throw new ForbiddenError('Insufficient permissions to update members')
    }

    // Get the member to update
    const member = await db.businessMember.findUnique({
      where: { id: memberId },
      select: { id: true, role: true },
    })

    if (!member) {
      throw new NotFoundError('Member not found')
    }

    // Check if can assign the new role
    if (requestBody.role && !hasHigherRoleOrEqual(userRole || 'VIEWER', requestBody.role)) {
      throw new ForbiddenError('Cannot assign a role higher than your own')
    }

    // Update member
    const updateData: any = {}
    if (requestBody.role) updateData.role = requestBody.role
    if (requestBody.permissions) updateData.permissions = JSON.stringify(requestBody.permissions)

    const updatedMember = await db.businessMember.update({
      where: { id: memberId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Member updated successfully',
    })
  } catch (error: any) {
    logError(error, 'Update business member', businessId || 'unknown')

    if (error.statusCode) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update member',
    }, { status: 500 })
  }
}

// DELETE /api/businesses/[id]/members - Remove member from business
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let userId: string | null = null
  let businessId: string | undefined
  try {
    const paramsData = await params
    businessId = paramsData.id

    const requestBody = await request.json()
    const { memberId } = requestBody

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

    if (!userId) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Authorization - Check if user can remove this member
    const userRole = await getUserBusinessRole(userId, businessId)

    if (!userRole) {
      throw new ForbiddenError('You are not a member of this business')
    }

    // Get the member to remove
    const member = await db.businessMember.findUnique({
      where: { id: memberId },
      select: { id: true, userId: true, role: true },
    })

    if (!member) {
      throw new NotFoundError('Member not found')
    }

    // Owner can remove anyone, others can only remove themselves or lower roles
    const canRemove = userRole === 'OWNER' || member.userId === userId

    if (!canRemove) {
      throw new ForbiddenError('Insufficient permissions to remove this member')
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
    logError(error, 'Remove business member', businessId || 'unknown')

    if (error.statusCode) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to remove member',
    }, { status: 500 })
  }
}
