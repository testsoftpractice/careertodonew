import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt-edge'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'

// ==================== BUSINESSES API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.status as string | undefined
    const universityId = searchParams.universityId as string | undefined
    const businessLeadId = searchParams.businessLeadId as string | undefined
    const seekingInvestment = searchParams.seekingInvestment as string | undefined
    const seekingCollaborators = searchParams.seekingCollaborators as string | undefined

    const where: any = {}

    if (status) {
      where.status = status as any
    }

    if (universityId) {
      where.universityId = universityId
    }

    if (businessLeadId) {
      where.businessLeadId = businessLeadId
    }

    if (seekingInvestment) {
      where.seekingInvestment = seekingInvestment === 'true'
    }

    if (seekingCollaborators) {
      where.seekingCollaborators = true
    }

    const businesses = await db.project.findMany({
      where,
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

    // Check if user is a student or mentor
    if (user.role !== 'STUDENT' && user.role !== 'MENTOR' && user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Only students, mentors, and platform admins can create businesses',
      }, { status: 403 })
    }

    const body = await request.json()

    // Create the business/project
    const business = await db.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        projectLeadId: userId,
        universityId: user.universityId,
        status: 'PROPOSED', // Business needs university approval
        seekingInvestment: body.seekingInvestment || false,
        investmentGoal: body.investmentGoal ? parseFloat(body.investmentGoal) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      }
    })

    // Award points for creating a business
    const pointsAwarded = 50
    await db.user.update({
      where: { id: userId },
      data: {
        executionScore: {
          increment: 10,
        },
        collaborationScore: {
          increment: 10,
        },
        leadershipScore: {
          increment: 10,
        },
        ethicsScore: {
          increment: 10,
        },
        reliabilityScore: {
          increment: 10,
        },
      },
    })

    // Create points log entry
    await db.pointTransaction.create({
      data: {
        userId: userId,
        points: pointsAwarded,
        source: 'BUSINESS_CREATION',
        description: `Created business: ${body.title}`,
        metadata: JSON.stringify({
          businessId: business.id,
          category: body.category,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      data: business,
      message: `Business created successfully! +${pointsAwarded} points earned`,
    }, { status: 201 })
  } catch (error: any) {
    logError(error, 'Create business', userId || 'unknown')
    
    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create business',
    }, { status: 500 })
  }
}
