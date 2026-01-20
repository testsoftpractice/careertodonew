import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'
import { z } from 'zod'

// GET /api/leave-requests - Get all leave requests for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (status) {
      where.status = status as any
    }

    // Fetch leave requests
    const requests = await db.leaveRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: requests,
      message: 'Leave requests fetched successfully',
    })
  } catch (error) {
    console.error('GET leave-requests error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leave requests',
      message: 'Failed to fetch leave requests',
    })
  }
}

// POST /api/leave-requests - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.leaveType) {
      return NextResponse.json({
        success: false,
        error: 'Leave type is required',
        message: 'Leave type is required',
      })
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json({
        success: false,
        error: 'Start date and end date are required',
        message: 'Start date and end date are required',
      })
    }

    // Validate date range
    if (new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date',
        message: 'End date must be after start date',
      })
    }

    if (!body.reason) {
      return NextResponse.json({
        success: false,
        error: 'Reason is required',
        message: 'Reason is required',
      })
    }

    // Create leave request
    const leaveRequest = await db.leaveRequest.create({
      data: {
        userId: session.user.id,
        leaveType: body.leaveType,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      data: leaveRequest,
      message: 'Leave request created successfully',
    })
  } catch (error) {
    console.error('POST leave-requests error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create leave request',
      message: 'Failed to create leave request',
    })
  }
}

// PATCH /api/leave-requests/[id] - Update leave request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: requestId } = await params
    if (!requestId) {
      return NextResponse.json({
        success: false,
        error: 'Leave request ID is required',
        message: 'Leave request ID is required',
      })
    }

    const body = await request.json()
    const { status, rejectionReason, reviewedBy } = body

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      })
    }

    // Update leave request
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status === 'APPROVED' || status === 'REJECTED') {
      updateData.reviewedBy = session.user.id
      if (status === 'REJECTED' && rejectionReason) {
        updateData.rejectionReason = rejectionReason
      }
    }

    const leaveRequest = await db.leaveRequest.update({
      where: { id: requestId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: leaveRequest,
      message: `Leave request ${status.toLowerCase()} successfully`,
    })
  } catch (error) {
    console.error('PATCH leave-requests/[id] error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update leave request',
      message: 'Failed to update leave request',
    })
  }
}

// DELETE /api/leave-requests/[id] - Delete leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: requestId } = await params
    if (!requestId) {
      return NextResponse.json({
        success: false,
        error: 'Leave request ID is required',
        message: 'Leave request ID is required',
      })
    }

    // Check if user owns the leave request
    const leaveRequest = await db.leaveRequest.findUnique({
      where: {
        id: requestId,
        userId: session.user.id,
      },
    })

    if (!leaveRequest) {
      return NextResponse.json({
        success: false,
        error: 'Leave request not found',
        message: 'Leave request not found',
      })
    }

    if (leaveRequest.status === 'APPROVED' || leaveRequest.status === 'REJECTED') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete approved or rejected leave request',
        message: 'Cannot delete approved or rejected leave request',
      })
    }

    await db.leaveRequest.delete({
      where: { id: requestId },
    })

    return NextResponse.json({
      success: true,
      message: 'Leave request deleted successfully',
    })
  } catch (error) {
    console.error('DELETE leave-requests/[id] error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete leave request',
      message: 'Failed to delete leave request',
    })
  }
}
