import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'
import { UniversityVerificationStatus } from '@prisma/client'

// GET /api/verification-requests - Get verification requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requesterId = searchParams.get('requesterId')
  const status = searchParams.get('status') || 'all'

  if (!requesterId) {
    return NextResponse.json({ error: 'Requester ID is required' }, { status: 400 })
  }

  try {
    const where: any = {
      requesterId
    }

    if (status) {
      where.status = status as any
    }

    const requests = await db.verificationRequest.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            university: {
              select: {
                id: true,
                name: true,
                code: true,
                verificationStatus: true
              }
            }
          }
        },
        university: {
          select: {
            id: true,
            name: true,
            code: true,
            verificationStatus: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedRequests = requests.map(req => ({
      id: req.id,
      type: req.type,
      status: req.status,
      documents: req.documents,
      submittedAt: req.createdAt,
      reviewedAt: req.reviewedAt,
      notes: req.notes,
      requester: req.requester,
      university: req.university,
      reviewer: req.reviewer
    }))

    return NextResponse.json({
      success: true,
      data: formattedRequests
    })
  } catch (error) {
    console.error('Get verification requests error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
