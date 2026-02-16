import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth, AuthError } from '@/lib/auth/verify'
import { unauthorized, forbidden, errorResponse } from '@/lib/api-response'
import { cachedResponse, noCacheResponse, addCacheHeaders } from '@/lib/api-cache'
import { z } from 'zod'

// GET /api/leave-requests - Get all leave requests for a user or project
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return unauthorized('Authentication required')
    }

    const userId = request.nextUrl.searchParams.get('userId')
    const projectId = request.nextUrl.searchParams.get('projectId')
    const status = request.nextUrl.searchParams.get('status')

    // Build where clause
    const where: Record<string, any> = {}

    // If projectId is provided, fetch leave requests for that project
    if (projectId) {
      where.projectId = projectId
    } else if (userId) {
      // If userId is provided, fetch leave requests for that user
      where.userId = userId
    } else {
      // If neither is provided, return forbidden
      return forbidden('Please provide userId or projectId parameter')
    }

    if (status) {
      where.status = status
    }

    // Fetch leave requests with project data
    const requests = await db.leaveRequest.findMany({
      where,
      include: {
        Project: {
          select: {
            id: true,
            name: true,
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: requests,
      message: 'Leave requests fetched successfully',
    }, {
      headers: {
        'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
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
    if (!body.leaveType) {
      return NextResponse.json({
        success: false,
        error: 'Leave type is required',
        details: 'Please select a leave type from the dropdown',
      }, { status: 400 })
    }

    if (!body.startDate || !body.endDate) {
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
        projectId: body.projectId || null,
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
    if (error instanceof AuthError) {
      return errorResponse(error.message || 'Authentication required', error.statusCode || 401)
    }
    console.error('POST leave-requests error:', error)

    const errorMsg = error instanceof Error ? error.message : 'Failed to create leave request'
    const errorDetails = error instanceof Error ? error.stack : String(error)

    return NextResponse.json({
      success: false,
      error: errorMsg,
      details: errorDetails,
    }, { status: 500 })
  }
}
