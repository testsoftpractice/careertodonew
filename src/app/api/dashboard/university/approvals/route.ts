import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt-edge'
import { logError, formatErrorResponse, AppError, UnauthorizedError, ForbiddenError } from '@/lib/utils/error-handler'

// ==================== UNIVERSITY APPROVAL API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const universityId = searchParams.universityId as string | undefined

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
        projectLead: {
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
        members: {
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
          members: true,
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
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, universityId: true, university: { name: true } },
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
        projectLead: {
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
        members: {
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
          members: true,
        },
      },
    })

    if (!business) {
      return NextResponse.json({
      success: false,
      error: 'Business not found',
      }, { status: 404 })
    }

    if (business.status !== 'PROPOSED') {
      return NextResponse.json({
        success: false,
        error: 'Business is not in PROPOSED status',
      }, { status: 400 })
    }

    const action = body.action // 'approve' or 'reject'

    // Update business status
    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'

    // Prepare update data
    const updateData: {
      status: string
      approvalDate: Date | null
      terminationReason: string | null
      terminationDate: Date | null
    } = {
      status,
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
      where: { id: business.projectLeadId },
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
        userId: business.projectLeadId,
        points: pointsAwarded,
        source: action === 'approve' ? 'BUSINESS_APROVAL' : 'BUSINESS_REJECTION',
        description: `${action === 'approve' ? 'Approved' : 'Rejected'} business: ${business.title}`,
        metadata: JSON.stringify({
          businessId: business.id,
          universityId: business.universityId,
          action,
          comment: body.comments || '',
        }),
      },
    })

    // Award points to university admin for approving student business
    if (user.universityId) {
      await db.user.update({
        where: { id: user.id },
        data: {
          executionScore: { increment: action === 'approve' ? 5 : 0 },
          collaborationScore: { increment: action === 'approve' ? 5 : 0 },
          leadershipScore: { increment: action === 'approve' ? 5 : 0 },
          ethicsScore: { increment: action === 'approve' ? 5 : 0 },
          reliabilityScore: { increment: action === 'approve' ? 5 : 0 },
        },
      })

      await db.university.update({
        where: { id: user.universityId },
        data: {
          totalProjects: { increment: action === 'approve' ? 1 : 0 },
        },
      })
    }

    // Send notification to business lead
    await db.notification.create({
      data: {
        userId: business.projectLeadId,
        type: action === 'approve' ? 'BUSINESS_APROVAL' : 'BUSINESS_REJECTION',
        title: action === 'approve' ? '🎉 Business Approved!' : '❌ Business Rejected',
        message: `Your business "${business.title}" has been ${action.toLowerCase()}.`,
        link: `/businesses/${business.id}`,
      },
    })

    // Send notification to all business members
    const memberIds = business.members.map((m) => m.userId)

    if (memberIds.length > 0) {
      await db.notification.createMany({
        data: memberIds.map((userId) => ({
          userId,
          type: action === 'approve' ? 'BUSINESS_APROVAL' : 'BUSINESS_REJECTION',
          title: action === 'approve' ? 'Team Business Approved!' : 'Team Business Rejected',
          message: `A business you're part of "${business.title}" has been ${action.toLowerCase()}`,
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
