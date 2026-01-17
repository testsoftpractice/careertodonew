import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/investments/proposals - List investment proposals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const investorId = searchParams.get('investorId')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {}

    if (investorId) {
      where.investorId = investorId
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const proposals = await db.investment.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: proposals.map((prop) => ({
        id: prop.id,
        projectId: prop.projectId,
        project: prop.project,
        investorId: prop.investorId,
        investor: prop.investor,
        type: prop.type,
        status: prop.status,
        amount: prop.amount,
        equity: prop.equity,
        terms: prop.terms ? JSON.parse(prop.terms) : null,
        agreementId: prop.agreementId,
        createdAt: prop.createdAt,
        updatedAt: prop.updatedAt,
        fundedAt: prop.fundedAt,
        expiresAt: prop.expiresAt,
      })),
    })
  } catch (error: any) {
    console.error('Get proposals error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/investments/proposals - Create investment proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, investorId, type, amount, equity, terms, message } = body

    // Check if project exists and is seeking investment
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    if (!project.seekingInvestment) {
      return NextResponse.json(
        { success: false, error: 'This project is not seeking investment' },
        { status: 400 }
      )
    }

    // Check if investor already has a proposal for this project
    const existingProposal = await db.investment.findFirst({
      where: {
        projectId,
        investorId,
      },
    })

    if (existingProposal) {
      return NextResponse.json(
        { success: false, error: 'You already have a proposal for this project' },
        { status: 400 }
      )
    }

    // Create investment proposal
    const proposal = await db.investment.create({
      data: {
        projectId,
        investorId,
        type,
        status: 'INTERESTED',
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
        type: 'INVESTMENT_PROPOSAL',
        title: 'New Investment Proposal',
        message: `${proposal.investor.name} has submitted a proposal for your project "${project.title}"`,
        link: `/projects/${projectId}/proposals`,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Investment proposal created successfully',
        data: proposal,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create proposal error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
