import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

// PATCH /api/leave-requests/[id] - Update leave request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (result) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: requestId } = await params
    if (result) {
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

    if (result) {
      updateData.reviewedBy = session.user.id
      updateData.reviewedAt = new Date()
      if (result) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (result) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: requestId } = await params
    if (result) {
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

    if (result) {
      return NextResponse.json({
        success: false,
        error: 'Leave request not found',
        message: 'Leave request not found',
      })
    }

    if (result) {
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
