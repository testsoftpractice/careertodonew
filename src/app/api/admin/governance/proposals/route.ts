import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

// GET /api/admin/governance/proposals - Get governance proposals
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    // Get proposals from verification requests (using them as governance proposals)
    const proposals = await db.verificationRequest.findMany({
      where,
      take: limit,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform proposals to match expected interface
    const transformedProposals = proposals.map(proposal => {
      let priority = 'MEDIUM'
      if (proposal.priority === 'HIGH' || proposal.priority === 'URGENT') {
        priority = proposal.priority
      }

      return {
        id: proposal.id,
        type: proposal.type || 'VERIFICATION',
        title: proposal.title || 'Verification Request',
        description: proposal.description || '',
        priority,
        status: proposal.status,
        currentStage: proposal.status === 'PENDING' ? 'SUBMITTED' : proposal.status,
        createdBy: proposal.User,
        createdAt: proposal.createdAt.toISOString(),
        projectId: proposal.projectId || undefined,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        proposals: transformedProposals,
        totalCount: transformedProposals.length,
      },
    })
  } catch (error: any) {
    console.error('Get governance proposals error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch governance proposals' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/governance/proposals - Update proposal status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    // Verify admin authentication
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status, reviewNote } = body

    // Update verification request
    const updated = await db.verificationRequest.update({
      where: { id },
      data: {
        status,
        reviewNote,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update proposal error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update proposal' },
      { status: 500 }
    )
  }
}
