import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/records/[id]/verify-request - Request verification for a record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { employerId, comment, type } = body

    // Check if record exists
    const record = await db.professionalRecord.findUnique({
      where: { id },
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

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      )
    }

    // Create verification request
    await db.verificationRequest.create({
      data: {
        userId: record.userId,
        type: type || 'RECORD_VERIFICATION',
        title: `Verification Request: ${record.title}`,
        description: comment || `Employer requested verification for ${record.title}`,
        projectId: null, // Record is not project-based
      },
    })

    // Notify the record owner about the verification request
    await db.notification.create({
      data: {
        userId: record.userId,
        type: 'VERIFICATION',
        title: 'Verification Request Received',
        message: `A verification request has been submitted for your record "${record.title}"`,
        link: `/records/${id}/verify`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully',
    })
  } catch (error: any) {
    console.error('Create verification request error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create verification request' },
      { status: 500 }
    )
  }
}
