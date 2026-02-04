import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError, ForbiddenError } from '@/lib/utils/error-handler'

// ==================== UNIVERSITY APPROVAL API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as string | undefined
    const universityId = searchParams.get('universityId') as string | undefined

    const where: any = {}

    if (status) {
      where.status = status as any
    }

    if (universityId) {
      where.universityId = universityId
    }

    // Fetch pending business approvals for this university
    const pendingBusinesses = await db.project.findMany({
      where: {
        ...where,
        status: 'PROPOSED',
        universityId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
        projectMembers: {
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
          },
          take: 10,
        },
        _count: {
          select: {
            projectMembers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        pendingBusinesses,
        count: pendingBusinesses.length,
      },
    })
  } catch (error) {
    console.error('University approvals API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pending business approvals',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let userId: string | null = null
  try {
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, universityId: true, university: { select: { name: true } } },
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    // Check if user is a university admin or platform admin
    if (user.role !== 'UNIVERSITY_ADMIN' && user.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenError('Only university admins and platform admins can approve businesses')
    }

    const body = await request.json()

    if (!body.businessId) {
      return NextResponse.json({
      success: false,
      error: 'Business ID is required',
      }, { status: 400 })
    }

    const business = await db.project.findUnique({
      where: { id: body.businessId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
                location: true,
              },
            },
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
        projectMembers: {
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
          },
          take: 10,
        },
        _count: {
          select: {
            projectMembers: true,
          },
        },
      },
    })

    if (!business) {
      return NextResponse.json({
      success: false,
      error: 'Business not found',
      }, { status: 404 })
    }

    if (business.status !== 'PROPOSED' as any) {
      return NextResponse.json({
        success: false,
        error: 'Business is not in PROPOSED status',
      }, { status: 400 })
    }

    const action = body.action // 'approve' or 'reject'

    // Prepare update data
    const updateData: any = {
      status: action === 'approve' ? 'ACTIVE' : 'CANCELLED',
      approvalDate: action === 'approve' ? new Date() : null,
      terminationReason: action === 'reject' ? (body.reason || '') : null,
      terminationDate: action === 'reject' ? new Date() : null,
    }

    // Update business
    const updatedBusiness = await db.project.update({
      where: { id: body.businessId },
      data: updateData,
    })

    // Award points to business lead for creating business
    const pointsAwarded = action === 'approve' ? 100 : 0

    await db.user.update({
      where: { id: business.ownerId },
      data: {
        executionScore: {
          increment: action === 'approve' ? 15 : 0,
        },
        collaborationScore: {
          increment: action === 'approve' ? 15 : 0,
        },
        leadershipScore: {
          increment: action === 'approve' ? 15 : 0,
        },
        ethicsScore: {
          increment: action === 'approve' ? 15 : 0,
        },
        reliabilityScore: {
          increment: action === 'approve' ? 15 : 0,
        },
      },
    })

    // Create point transaction for business lead
    await db.pointTransaction.create({
      data: {
        userId: business.ownerId,
        points: pointsAwarded,
        source: action === 'approve' ? 'BUSINESS_APPROVAL' : 'BUSINESS_REJECTION',
        description: `${action === 'approve' ? 'Approved' : 'Rejected'} business: ${business.name}`,
        metadata: JSON.stringify({
          businessId: business.id,
          universityId: business.universityId,
          action,
          comment: body.comments || '',
        }),
      },
    })

    // Award points to university admin for approving student business
    if (action === 'approve') {
      await db.user.update({
        where: { id: user.id },
        data: {
          executionScore: { increment: 5 },
          collaborationScore: { increment: 5 },
          leadershipScore: { increment: 5 },
          ethicsScore: { increment: 5 },
          reliabilityScore: { increment: 5 },
        },
      })

      if (user.universityId) {
        await db.university.update({
          where: { id: user.universityId },
          data: {
            totalProjects: { increment: 1 },
          },
        })
      }
    }

    // Send notification to business lead
    await db.notification.create({
      data: {
        userId: business.ownerId,
        type: action === 'approve' ? 'BUSINESS_APPROVAL' : 'BUSINESS_REJECTION',
        title: action === 'approve' ? '🎉 Business Approved!' : '❌ Business Rejected',
        message: `Your business "${business.name}" has been ${action.toLowerCase()}.`,
        link: `/businesses/${business.id}`,
      },
    })

    // Send notification to all business members
    const memberIds = (business as any).projectMembers?.map((m: any) => m.userId) || []

    if (memberIds.length > 0) {
      await db.notification.createMany({
        data: memberIds.map((memberId) => ({
          userId: memberId,
          type: action === 'approve' ? 'BUSINESS_APPROVAL' : 'BUSINESS_REJECTION',
          title: action === 'approve' ? 'Team Business Approved!' : 'Team Business Rejected',
          message: `A business you're part of "${business.name}" has been ${action.toLowerCase()}`,
          link: `/businesses/${business.id}`,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        business: updatedBusiness,
        message: `Business ${action.toLowerCase()}d successfully`,
        pointsAwarded: action === 'approve' ? 100 : 0,
      },
    })
  } catch (error: any) {
    logError(error, 'Business approval', userId || 'unknown')

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to process business approval',
    }, { status: 500 })
  }
}
