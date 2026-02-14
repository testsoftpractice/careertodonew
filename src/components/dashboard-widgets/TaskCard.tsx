import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED' | 'CANCELLED'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: Date
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  progress?: number
  projectId?: string
  projectName?: string
  className?: string
  onView?: (id: string) => void
  onEdit?: (id: string) => void
}

const priorityColors = {
  CRITICAL: 'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600',
  HIGH: 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600',
  MEDIUM: 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
  LOW: 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600',
}

const statusConfig = {
  BACKLOG: { icon: Circle, label: 'Backlog', color: 'text-muted-foreground' },
  TODO: { icon: Circle, label: 'To Do', color: 'text-blue-500 dark:text-blue-400' },
  IN_PROGRESS: { icon: Play, label: 'In Progress', color: 'text-amber-500 dark:text-amber-400' },
  REVIEW: { icon: AlertCircle, label: 'In Review', color: 'text-orange-500 dark:text-orange-400' },
  DONE: { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-500 dark:text-emerald-400' },
  BLOCKED: { icon: AlertCircle, label: 'Blocked', color: 'text-rose-500 dark:text-rose-400' },
  CANCELLED: { icon: Circle, label: 'Cancelled', color: 'text-muted-foreground' },
}

export function TaskCard({
  id,
  title,
  description,
  priority,
  status,
  dueDate,
  assignee,
  progress = 0,
  projectId,
  projectName,
  className = '',
  onView,
  onEdit,
}: TaskCardProps) {
  const statusInfo = statusConfig[status]
  const StatusIcon = statusInfo.icon

  const formatDate = (date: Date) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date < now) {
      return { text: 'Overdue', color: 'text-rose-600' }
    } else if (date < tomorrow) {
      return { text: 'Due Today', color: 'text-orange-600' }
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-muted-foreground' }
    }
  }

  const projectLink = projectId ? `/projects/${projectId}` : null

  return (
    <Card className={`${className} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs font-semibold ${priorityColors[priority]}`}>
                {priority}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                <span>{statusInfo.label}</span>
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
            {projectLink && (
              <Link
                href={projectLink}
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                {projectName}
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className={formatDate(dueDate).color}>
                  {formatDate(dueDate).text}
                </span>
              </div>
            )}
          </div>
          {assignee && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary">
                    {assignee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1 hidden sm:inline">
                {assignee.name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 mt-2">
          {projectLink && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`${projectLink}?tab=tasks`}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                View Details
              </Link>
            </Button>
          )}
          {!projectLink && onView && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(id)}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
