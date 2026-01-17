import { NextRequest, NextResponse } from 'next/server'

// Mock notification storage (in production, use database)
const notificationsStore = new Map<string, any[]>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get notifications for user
    const notifications = notificationsStore.get(userId) || []

    // Filter unread count
    const unreadCount = notifications.filter((n) => !n.read).length

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, link } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create notification
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type,
      title,
      message,
      link: link || null,
      timestamp: new Date().toISOString(),
      read: false,
    }

    // Store notification
    const userNotifications = notificationsStore.get(userId) || []
    userNotifications.unshift(notification)
    notificationsStore.set(userId, userNotifications)

    // Send real-time notification via Socket.IO if available
    if ((global as any).socketIO?.sendNotificationToUser) {
      ;(global as any).socketIO.sendNotificationToUser(userId, notification)
    }

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
