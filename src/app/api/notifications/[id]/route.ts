import { NextRequest, NextResponse } from 'next/server'

// Mock notification storage (in production, use database)
const notificationsStore = new Map<string, any[]>()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, action } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userNotifications = notificationsStore.get(userId) || []

    if (action === 'mark_read') {
      // Mark notification as read
      const notification = userNotifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
        notificationsStore.set(userId, userNotifications)

        return NextResponse.json({
          success: true,
          data: notification,
        })
      }

      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userNotifications = notificationsStore.get(userId) || []
    const updatedNotifications = userNotifications.filter((n) => n.id !== id)
    notificationsStore.set(userId, updatedNotifications)

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
