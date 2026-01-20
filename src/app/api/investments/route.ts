import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/investments - List investments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (userId) {
      where.userId = userId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
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
        userId: inv.userId,
        user: inv.user,
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
    const body = await request.json()
    const {
      userId,
      projectId,
      type,
      amount,
    } = body

    // Validate required fields
    if (!userId || !projectId) {
      return NextResponse.json(
        { success: false, error: 'userId and projectId are required' },
        { status: 400 }
      )
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

    // Check if user already has an investment in this project
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
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
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
    console.error('Create investment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
