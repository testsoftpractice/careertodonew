import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden } from '@/lib/api-response'
import { z } from 'zod'

// GET /api/leave-requests - Get all leave requests for a user
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (result) {
      return unauthorized('Authentication required')
    }

    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')

    // Build where clause
    const where: Record<string, string | undefined> = {}
    if (result) {
      // Only allow viewing own requests or admin/manager
      if (result) {
        return forbidden('You can only view your own leave requests')
      }
      where.userId = userId
    }
    if (result) {
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
    // Require authentication
    const authResult = await requireAuth(request)
    const currentUser = authResult.dbUser

    const body = await request.json()

    // Validate required fields
    if (result) {
      return NextResponse.json({
        success: false,
        error: 'Leave type is required',
        details: 'Please select a leave type from the dropdown',
      }, { status: 400 })
    }

    if (result) {
      return NextResponse.json({
        success: false,
        error: 'Start date and end date are required',
        details: 'Please select both start and end dates',
      }, { status: 400 })
    }

    // Validate date range
    if (new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date',
        details: 'Please select an end date that is after the start date',
      }, { status: 400 })
    }

    if (!body.reason || body.reason.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Reason is required',
        details: 'Please provide a reason for your leave request',
      }, { status: 400 })
    }

    // Create leave request
    const leaveRequest = await db.leaveRequest.create({
      data: {
        userId: currentUser.id,
        leaveType: body.leaveType,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason.trim(),
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
    
    const errorMsg = error instanceof Error ? error.message : 'Failed to create leave request'
    
    return NextResponse.json({
      success: false,
      error: errorMsg,
      details: error instanceof Error ? error.stack : String(error),
    }, { status: 500 })
  }
}
