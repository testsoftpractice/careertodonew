import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationRequestStatus } from '@prisma/client'

// GET /api/verification - List verification requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requesterId = searchParams.get('requesterId')
    const subjectId = searchParams.get('subjectId')
    const status = searchParams.get('status')

    const where: any = {}

    if (requesterId) {
      where.requesterId = requesterId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (status) {
      where.status = status as VerificationRequestStatus
    }

    const requests = await db.verificationRequest.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            avatar: true,
            university: {
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
      requesterId, // Employer ID
      subjectId, // Student/User ID
      purpose,
      accessDuration,
    } = body

    // Check if there's already a pending request
    const existingRequest = await db.verificationRequest.findFirst({
      where: {
        requesterId,
        subjectId,
        status: VerificationRequestStatus.PENDING,
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending verification request for this user' },
        { status: 400 }
      )
    }

    const verificationRequest = await db.verificationRequest.create({
      data: {
        requesterId,
        subjectId,
        purpose,
        status: VerificationRequestStatus.PENDING,
        accessDuration: accessDuration ? parseInt(accessDuration) : 30, // Default 30 days
        expiresAt: new Date(Date.now() + (accessDuration || 30) * 24 * 60 * 60 * 1000), // days in milliseconds
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create notification for the subject
    await db.notification.create({
      data: {
        userId: subjectId,
        type: 'VERIFICATION_REQUEST',
        title: 'Employer Verification Request',
        message: `${verificationRequest.requester.name} has requested access to verify your professional records`,
        link: `/dashboard/student/verification/${verificationRequest.id}`,
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
