import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { InvestmentType, InvestmentStatus } from '@prisma/client'

// GET /api/investments - List investments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const investorId = searchParams.get('investorId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (investorId) {
      where.investorId = investorId
    }

    if (status && status !== 'all') {
      where.status = status as InvestmentStatus
    }

    if (type && type !== 'all') {
      where.type = type as InvestmentType
    }

    const investments = await db.investment.findMany({
      where,
      include: {
        project: {
          include: {
            projectLead: {
              select: {
                id: true,
                name: true,
              },
            },
            university: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        agreement: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      investments: investments.map(inv => ({
        id: inv.id,
        projectId: inv.projectId,
        project: inv.project,
        investorId: inv.investorId,
        investor: inv.investor,
        type: inv.type,
        status: inv.status,
        amount: inv.amount,
        equity: inv.equity,
        terms: inv.terms,
        agreementId: inv.agreementId,
        agreement: inv.agreement,
        createdAt: inv.createdAt,
        fundedAt: inv.fundedAt,
        expiresAt: inv.expiresAt,
      })),
    })
  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/investments - Create a new investment interest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectId,
      investorId,
      type,
      amount,
      equity,
      terms,
    } = body

    // Check if project exists and is seeking investment
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (!project.seekingInvestment) {
      return NextResponse.json(
        { error: 'This project is not seeking investment' },
        { status: 400 }
      )
    }

    // Check if investor already has an investment in this project
    const existingInvestment = await db.investment.findFirst({
      where: {
        projectId,
        investorId,
      },
    })

    if (existingInvestment) {
      return NextResponse.json(
        { error: 'You already have an investment interest in this project' },
        { status: 400 }
      )
    }

    const investment = await db.investment.create({
      data: {
        projectId,
        investorId,
        type: type as InvestmentType,
        status: InvestmentStatus.INTERESTED,
        amount: amount ? parseFloat(amount) : null,
        equity: equity ? parseFloat(equity) : null,
        terms: terms ? JSON.stringify(terms) : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        project: {
          include: {
            projectLead: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        investor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create notification for project lead
    await db.notification.create({
      data: {
        userId: project.projectLeadId,
        type: 'INVESTMENT_REQUEST',
        title: 'New Investment Interest',
        message: `${investment.investor.name} has expressed interest in investing in your project "${project.title}"`,
        link: `/projects/${projectId}/investments`,
      },
    })

    return NextResponse.json(
      {
        message: 'Investment interest created successfully',
        investment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
