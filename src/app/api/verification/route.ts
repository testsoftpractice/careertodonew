import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationStatus } from '@/lib/constants'

// GET /api/verification - List verification requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status as VerificationStatus
    }

    const requests = await db.verificationRequest.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            University: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Get verification requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/verification - Create a new verification request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      type,
      title,
      description,
      projectId,
    } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await db.verificationRequest.findFirst({
      where: {
        userId,
        type,
        status: VerificationStatus.PENDING,
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending verification request of this type' },
        { status: 400 }
      )
    }

    const verificationRequest = await db.verificationRequest.create({
      data: {
        userId,
        type,
        title: title || null,
        description: description || null,
        projectId: projectId || null,
        status: VerificationStatus.PENDING,
        submittedAt: new Date(),
        createdAt: new Date(),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create notification for the user
    await db.notification.create({
      data: {
        userId: userId,
        type: 'VERIFICATION',
        title: 'Verification Request Submitted',
        message: `Your verification request for "${type}" has been submitted`,
        link: `/dashboard/student/verifications/${verificationRequest.id}`,
      },
    })

    return NextResponse.json(
      {
        message: 'Verification request created successfully',
        request: verificationRequest,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create verification request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
