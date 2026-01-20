import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'task' | 'project' | 'message' | 'notification' | 'achievement'
  title: string
  description: string
  icon: LucideIcon
  timestamp: Date
  actionUrl?: string
  actionLabel?: string
  status?: 'success' | 'pending' | 'warning' | 'error'
}

interface ActivityListProps {
  items: ActivityItem[]
  title?: string
  maxItems?: number
  className?: string
}

const statusColors = {
  success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  warning: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  error: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
}

export function ActivityList({
  items,
  title = 'Recent Activity',
  maxItems = 10,
  className = '',
}: ActivityListProps) {
  const displayItems = items.slice(0, maxItems)

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ]

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds)
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
      }
    }

    return 'Just now'
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className={`${statusColors[item.status || 'pending']} p-2 rounded-lg flex-shrink-0`}>
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm sm:text-base font-medium line-clamp-1">
                    {item.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 mt-2 transition-colors"
                  >
                    {item.actionLabel || 'View Details'}
                  </Link>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
