import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/investments/deals - List deals
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

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
    const userId = searchParams.get('investorId') || searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {}

    // Only allow users to see their own deals unless they are platform admin
    const isAdmin = decoded.role === 'PLATFORM_ADMIN'
    if (!isAdmin && userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only view your own deals' },
        { status: 403 }
      )
    }

    // Default to active deal statuses if no filter provided
    if (!status || status === 'all') {
      where.status = {
        in: ['UNDER_REVIEW', 'AGREED', 'FUNDED'],
      }
    } else {
      where.status = status
    }

    if (userId) {
      where.userId = userId
    }

    if (projectId) {
      where.projectId = projectId
    }

    const deals = await db.investment.findMany({
      where,
      include: {
        Project: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            University: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        User: {
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

// PUT /api/investments/deals - Update deal status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    // Verify authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

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
    const { id, status, terms, agreementId } = body
    const dealId = id

    // Check if deal exists
    const deal = await db.investment.findUnique({
      where: { id: dealId },
      include: {
        Project: true,
        User: true,
      },
    })

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update this deal
    const isAdmin = decoded.role === 'PLATFORM_ADMIN'
    if (!isAdmin && deal.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Can only update your own deals' },
        { status: 403 }
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
        Project: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create notifications based on status change
    if (status === 'UNDER_REVIEW') {
      await db.notification.create({
        data: {
          userId: deal.userId,
          type: 'DEAL_UPDATE',
          title: 'Deal Under Review',
          message: `Your proposal for "${deal.Project.name}" is now under review`,
          link: `/dashboard/investor/deals/${dealId}`,
        },
      })
    } else if (status === 'AGREED') {
      // Notify both parties
      await db.notification.create({
        data: {
          userId: deal.userId,
          type: 'DEAL_UPDATE',
          title: 'Deal Agreed',
          message: `Congratulations! The deal for "${deal.Project.name}" has been agreed`,
          link: `/dashboard/investor/deals/${dealId}`,
        },
      })

      await db.notification.create({
        data: {
          userId: deal.Project.ownerId,
          type: 'DEAL_UPDATE',
          title: 'Deal Agreed',
          message: `The investment deal for "${deal.Project.name}" has been agreed with ${deal.User.name}`,
          link: `/projects/${deal.projectId}/deals/${dealId}`,
        },
      })
    } else if (status === 'FUNDED') {
      await db.notification.create({
        data: {
          userId: deal.userId,
          type: 'INVESTMENT',
          title: 'Deal Funded',
          message: `Your investment in "${deal.Project?.name || 'Unknown Project'}" has been funded successfully`,
          link: `/dashboard/investor/portfolio/${dealId}`,
        },
      })

      if (deal.Project) {
        await db.notification.create({
          data: {
            userId: deal.Project.ownerId,
            type: 'INVESTMENT',
            title: 'Deal Funded',
            message: `The investment from ${deal.User.name} has been funded`,
            link: `/projects/${deal.projectId}/investments`,
          },
        })
      }
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
