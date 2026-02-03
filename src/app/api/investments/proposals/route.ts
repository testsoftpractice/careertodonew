import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/investments/proposals - List investment proposals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const investorId = searchParams.get('investorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

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
    const body = await request.json()
    const { projectId, userId, type, amount, equity, terms, message } = body

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
        amount: amount ? parseFloat(amount) : null,
        equity: equity ? parseFloat(equity) : null,
        terms: terms ? JSON.stringify(terms) : null,
        status: 'PENDING',
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
