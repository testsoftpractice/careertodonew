'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface Notification {
  id: string
  type: 'TASK' | 'PROJECT' | 'RATING' | 'VERIFICATION' | 'INVESTMENT' | 'AGREEMENT' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
  relatedId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }

  return context
}
