import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/investments/proposals - List investment proposals
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const investorId = searchParams.get('investorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    // Only allow users to see their own proposals unless they are platform admin
    const isAdmin = decoded.role === 'PLATFORM_ADMIN'
    if (investorId && !isAdmin && investorId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only view your own proposals' },
        { status: 403 }
      )
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (status) {
      where.status = status
    }

    if (investorId) {
      where.userId = investorId
    }

    const proposals = await db.investment.findMany({
      where,
      include: {
        project: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return NextResponse.json({
      success: true,
      data: proposals,
      pagination: {
        page,
        limit,
        totalCount: 0, // Will calculate below
        totalPages: 0, // Will calculate below
      },
    })
  } catch (error) {
    console.error('Get proposals error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch proposals',
    }, { status: 500 })
  }
}

// POST /api/investments/proposals - Create investment proposal
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { projectId, userId, type, amount, equity, terms, message } = body

    // Verify userId matches authenticated user
    if (userId !== decoded.userId && decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: Can only create proposals for yourself',
      }, { status: 403 })
    }

    if (!projectId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'projectId and userId are required',
      }, { status: 400 })
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found',
      }, { status: 404 })
    }

    const proposal = await db.investment.create({
      data: {
        projectId,
        userId,
        type,
        amount: amount ? Number(amount) : null,
        equity: equity ? Number(equity) : null,
        terms: terms ? JSON.stringify(terms) : null,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })

    return NextResponse.json({
      success: true,
      data: proposal,
      message: 'Investment proposal created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create proposal error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create investment proposal',
    }, { status: 500 })
  }
}
