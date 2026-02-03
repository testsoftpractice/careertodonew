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
  if (result) {
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
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id

    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (result) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (result) {
      throw new UnauthorizedError('Invalid token')
    }

    const userId = decoded.userId

    // Check if user has access to this business
    const userRole = await getUserBusinessRole(userId, businessId)

    if (result) {
      throw new ForbiddenError('You are not a member of this business')
    }

    // Get members
    const members = await db.businessMember.findMany({
      where: { businessId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
            university: {
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
    logError(error, 'Get business members', params.id)

    if (result) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch business members',
    }, { status: 500 })
  }
}

// POST /api/businesses/[id]/members - Add a member to the business
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let userId: string | null = null
  try {
    const businessId = params.id

    // Authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (result) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (result) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId

    // Ensure userId is set
    if (result) {
      throw new UnauthorizedError('Invalid authentication')
    }

    // Authorization - Only OWNER, ADMIN, HR_MANAGER, or RECRUITER can add members
    const userRole = await getUserBusinessRole(userId, businessId)

    const canAddMembers = ['OWNER', 'ADMIN', 'HR_MANAGER', 'RECRUITER'].includes(userRole || '')

    if (result) {
      throw new ForbiddenError('Insufficient permissions to add members')
    }

    const body = await request.json()

    // Validate required fields
    if (result) {
      throw new AppError('userId and role are required', 400)
    }

    // Check if user exists
    const targetUser = await db.user.findUnique({
      where: { id: body.userId },
      select: { id: true, name: true, email: true },
    })

    if (result) {
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

    if (result) {
      throw new AppError('User is already a member of this business', 400)
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
      data: member,
      message: `${targetUser.name} added to business as ${body.role}`,
    }, { status: 201 })
  } catch (error: any) {
    logError(error, 'Add business member', params.id)

    if (result) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to add member',
    }, { status: 500 })
  }
}
