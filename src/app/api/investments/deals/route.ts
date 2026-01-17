import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/investments/deals - List deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const investorId = searchParams.get('investorId')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {
      status: {
        in: ['UNDER_REVIEW', 'AGREED', 'FUNDED'],
      },
    }

    if (investorId) {
      where.investorId = investorId
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const deals = await db.investment.findMany({
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
        agreement: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    // Calculate deal metrics
    const dealsWithMetrics = deals.map((deal) => {
      const created = new Date(deal.createdAt)
      const funded = deal.fundedAt ? new Date(deal.fundedAt) : null
      const daysToClose = funded
        ? Math.ceil((funded.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        ...deal,
        daysToClose,
        stage: getDealStage(deal.status),
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        deals: dealsWithMetrics,
        summary: {
          totalDeals: dealsWithMetrics.length,
          activeDeals: dealsWithMetrics.filter((d) => d.status === 'UNDER_REVIEW').length,
          agreedDeals: dealsWithMetrics.filter((d) => d.status === 'AGREED').length,
          fundedDeals: dealsWithMetrics.filter((d) => d.status === 'FUNDED').length,
          averageDaysToClose: dealsWithMetrics
            .filter((d) => d.daysToClose !== null)
            .reduce((sum, d) => sum + (d.daysToClose || 0), 0) /
            dealsWithMetrics.filter((d) => d.daysToClose !== null).length || 1,
        },
      },
    })
  } catch (error: any) {
    console.error('Get deals error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to determine deal stage
function getDealStage(status: string): string {
  switch (status) {
    case 'INTERESTED':
      return 'INITIAL'
    case 'UNDER_REVIEW':
      return 'DILIGENCE'
    case 'AGREED':
      return 'NEGOTIATION'
    case 'FUNDED':
      return 'CLOSED'
    default:
      return 'UNKNOWN'
  }
}

// PUT /api/investments/deals/[id] - Update deal status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id
    const body = await request.json()
    const { status, terms, agreementId } = body

    // Check if deal exists
    const deal = await db.investment.findUnique({
      where: { id: dealId },
      include: {
        project: true,
        investor: true,
      },
    })

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Update deal
    const updatedDeal = await db.investment.update({
      where: { id: dealId },
      data: {
        status,
        terms: terms ? JSON.stringify(terms) : deal.terms,
        agreementId,
        fundedAt: status === 'FUNDED' ? new Date() : deal.fundedAt,
        updatedAt: new Date(),
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
            email: true,
          },
        },
        agreement: true,
      },
    })

    // Create notifications based on status change
    if (status === 'UNDER_REVIEW') {
      await db.notification.create({
        data: {
          userId: deal.investorId,
          type: 'DEAL_UPDATE',
          title: 'Deal Under Review',
          message: `Your proposal for "${deal.project.title}" is now under review`,
          link: `/dashboard/investor/deals/${dealId}`,
        },
      })
    } else if (status === 'AGREED') {
      // Notify both parties
      await db.notification.create({
        data: {
          userId: deal.investorId,
          type: 'DEAL_UPDATE',
          title: 'Deal Agreed',
          message: `Congratulations! The deal for "${deal.project.title}" has been agreed`,
          link: `/dashboard/investor/deals/${dealId}`,
        },
      })

      await db.notification.create({
        data: {
          userId: deal.project.projectLeadId,
          type: 'DEAL_UPDATE',
          title: 'Deal Agreed',
          message: `The investment deal for "${deal.project.title}" has been agreed with ${deal.investor.name}`,
          link: `/projects/${deal.projectId}/deals/${dealId}`,
        },
      })
    } else if (status === 'FUNDED') {
      await db.notification.create({
        data: {
          userId: deal.investorId,
          type: 'DEAL_FUNDED',
          title: 'Deal Funded',
          message: `Your investment in "${deal.project.title}" has been funded successfully`,
          link: `/dashboard/investor/portfolio/${dealId}`,
        },
      })

      await db.notification.create({
        data: {
          userId: deal.project.projectLeadId,
          type: 'DEAL_FUNDED',
          title: 'Deal Funded',
          message: `The investment from ${deal.investor.name} has been funded`,
          link: `/projects/${deal.projectId}/investments`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Deal updated successfully',
      data: updatedDeal,
    })
  } catch (error: any) {
    console.error('Update deal error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
