import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, errorResponse } from '@/lib/api-response'

// GET /api/investments - List investments with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult) {
      return unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const investorId = searchParams.get('investorId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, string | undefined> = {}

    if (projectId) {
      where.projectId = projectId
    }

    // If filtering by investorId, only allow viewing own investments or admin
    if (investorId) {
      if (authResult.user?.id !== investorId && authResult.user?.role !== 'PLATFORM_ADMIN') {
        return forbidden('You can only view your own investments')
      }
      where.userId = investorId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const investments = await db.investment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: investments.map(inv => ({
        id: inv.id,
        investorId: inv.userId,
        investor: inv.user,
        projectId: inv.projectId,
        project: inv.project,
        type: inv.type,
        status: inv.status,
        amount: inv.amount,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
      })),
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Get investments error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/investments - Create a new investment
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()
    const { userId,
      projectId,
      type,
      amount, } = body

    // Users can only create investments for themselves
    if (currentUser.id !== userId && currentUser.role !== 'PLATFORM_ADMIN') {
      return forbidden('You can only create investments for yourself')
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { id: true, name: true },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if investor already has an investment in this project
    const existingInvestment = await db.investment.findFirst({
      where: {
        projectId,
        userId,
      },
    })

    if (existingInvestment) {
      return NextResponse.json(
        { success: false, error: 'You already have an investment in this project' },
        { status: 400 }
      )
    }

    const investment = await db.investment.create({
      data: {
        userId,
        projectId,
        type: type || 'EQUITY',
        status: 'PENDING',
        amount: amount ? parseFloat(amount) : 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create notification for project owner
    await db.notification.create({
      data: {
        userId: project.owner.id,
        type: 'INVESTMENT',
        title: 'New Investment',
        message: `${investment.user.name} has invested in your project "${project.name}"`,
        priority: 'HIGH',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Investment created successfully',
        data: investment,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('Create investment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
