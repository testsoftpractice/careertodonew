'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Bell,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
  Check,
  Calendar,
  User,
  Briefcase,
  FileText,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

type Notification = {
  id: string
  type: string
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await fetch(`/api/notifications?userId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setNotifications(data.data.notifications || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to load notifications',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch notifications error:', error)
        toast({
          title: 'Error',
          description: 'Failed to load notifications',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case 'TASK_DUE':
        return <Calendar className="h-5 w-5 text-orange-500" />
      case 'PROJECT_UPDATE':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'RECORD_REQUEST':
        return <FileText className="h-5 w-5 text-purple-500" />
      case 'RATING_RECEIVED':
        return <CheckCircle2 className="h-5 w-5 text-yellow-500" />
      case 'SYSTEM':
        return <Bell className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return 'Task Assigned'
      case 'TASK_DUE':
        return 'Task Due'
      case 'PROJECT_UPDATE':
        return 'Project Update'
      case 'RECORD_REQUEST':
        return 'Record Request'
      case 'RATING_RECEIVED':
        return 'Rating Received'
      case 'SYSTEM':
        return 'System'
      default:
        return 'Notification'
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        )
      }
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return

    try {
      setMarkingAll(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        toast({
          title: 'Success',
          description: 'All notifications marked as read',
        })
      }
    } catch (error) {
      console.error('Mark all as read error:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive',
      })
    } finally {
      setMarkingAll(false)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast({
          title: 'Deleted',
          description: 'Notification deleted',
        })
      }
    } catch (error) {
      console.error('Delete notification error:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read
    if (activeTab === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                >
                  {markingAll ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Mark All Read
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/student">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notifications List */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading notifications...</p>
              </CardContent>
            </Card>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {getNotificationTypeLabel(notification.type)}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base">
                              {notification.title}
                            </h3>
                          </div>

                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>

                          {notification.link && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={notification.link}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'unread'
                    ? "You don't have any unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
