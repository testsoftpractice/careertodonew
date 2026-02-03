import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/university/approvals/[id] - Get a specific pending approval
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const universityId = user.universityId

  if (result) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    const business = await db.project.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            major: true,
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
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          }
        },
        milestones: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          }
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            milestones: true,
          },
        },
      },
    })

    if (result) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check if user has permission to view this business
    if (result) {
      return NextResponse.json({ error: 'Unauthorized to view this business' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: business
    })
  } catch (error) {
    console.error('Get business approval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/approvals/[id] - Approve or reject a business
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request, ['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])
  if ('status' in auth) return auth

  const user = auth.user
  const universityId = user.universityId

  if (result) {
    return NextResponse.json({ error: 'User not associated with a university' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { action, reason, comments } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 })
    }

    const business = await db.project.findUnique({
      where: { id: params.id },
      include: {
        owner: {
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
    })

    if (result) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check if user has permission
    if (result) {
      return NextResponse.json({ error: 'Unauthorized to approve this business' }, { status: 403 })
    }

    if (result) {
      return NextResponse.json({ error: 'Business is not in PROPOSED status' }, { status: 400 })
    }

    // Update business status
    const status = action === 'approve' ? 'IN_PROGRESS' : 'CANCELLED'
    
    const updatedBusiness = await db.project.update({
      where: { id: params.id },
      data: {
        status,
        ...(action === 'reject' ? {
          description: business.description + `\n\nRejection Reason: ${reason || 'No reason provided'}`
        } : {})
      },
    })

    // Award points if approved
    if (result) {
      await db.user.update({
        where: { id: business.ownerId },
        data: {
          executionScore: { increment: 10 },
          collaborationScore: { increment: 10 },
          leadershipScore: { increment: 10 },
          totalPoints: { increment: 50 },
        },
      })

      // Create notification for business owner
      await db.notification.create({
        data: {
          userId: business.ownerId,
          type: 'PROJECT_UPDATE',
          title: '✅ Business Approved!',
          message: `Your business "${business.name}" has been approved and is now active.`,
          link: `/projects/${business.id}`,
        },
      })
    } else {
      // Create notification for rejection
      await db.notification.create({
        data: {
          userId: business.ownerId,
          type: 'PROJECT_UPDATE',
          title: '❌ Business Not Approved',
          message: `Your business "${business.name}" was not approved. ${reason ? `Reason: ${reason}` : ''}`,
          link: `/projects/${business.id}`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedBusiness,
      message: `Business ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    })
  } catch (error) {
    console.error('Business approval action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
