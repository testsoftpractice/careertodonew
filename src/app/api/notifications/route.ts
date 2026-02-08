import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'
import { logError, formatErrorResponse, AppError, UnauthorizedError } from '@/lib/utils/error-handler'

// GET /api/notifications - Get notifications for user
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unread') === 'true'

    // Users can only view their own notifications unless they are platform admin
    const isAdmin = decoded.role === 'PLATFORM_ADMIN'
    if (!isAdmin && userId !== decoded.userId) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: Can only view your own notifications',
      }, { status: 403 })
    }

    // Default to authenticated user's ID
    const targetUserId = userId || decoded.userId

    if (!targetUserId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 })
    }

    const where: any = { userId: targetUserId }

    if (unreadOnly) {
      where.read = false
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // Count unread
    const unreadCount = await db.notification.count({
      where: { userId: targetUserId, read: false },
    })

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications',
    }, { status: 500 })
  }
}

// POST /api/notifications - Create a notification
export async function POST(request: NextRequest) {
  let userId: string | null = null
  try {
    const body = await request.json()
    const { targetUserId, type, title, message, link } = body

    // Authentication check for creating notifications
    const sessionCookie = request.cookies.get('session')
    const token = sessionCookie?.value

    if (!token) {
      throw new UnauthorizedError('Authentication required')
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      throw new UnauthorizedError('Invalid token')
    }

    userId = decoded.userId

    // Only platform admins can create notifications for other users
    if (targetUserId && decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'You can only create notifications for yourself',
      }, { status: 403 })
    }

    // Determine target user
    const notificationUserId = targetUserId || userId

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      }, { status: 400 })
    }

    // Create notification
    const notification = await db.notification.create({
      data: {
        userId: notificationUserId,
        type,
        title,
        message,
        link,
        priority: body.priority || 'MEDIUM',
        read: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error: any) {
    logError(error, 'Create notification', userId || 'unknown')

    if (error instanceof AppError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create notification',
    }, { status: 500 })
  }
}
