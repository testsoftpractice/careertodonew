import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface ProjectCardProps {
  id: string
  name: string
  description?: string
  status: 'IDEA' | 'UNDER_REVIEW' | 'FUNDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD'
  startDate?: Date
  endDate?: Date
  budget?: number
  membersCount?: number
  tasksCount?: number
  progress?: number
  category?: string
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  className?: string
}

const statusConfig = {
  IDEA: { label: 'Idea', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700', icon: '📝' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900', icon: '🔍' },
  FUNDING: { label: 'Funding', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900', icon: '💰' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900', icon: '🚀' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900', icon: '✅' },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900', icon: '❌' },
  ON_HOLD: { label: 'On Hold', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700', icon: '⏸' },
}

export function ProjectCard({
  id,
  name,
  description,
  status,
  startDate,
  endDate,
  budget,
  membersCount = 0,
  tasksCount = 0,
  progress = 0,
  category,
  owner,
  className = '',
}: ProjectCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <Card className={`${className} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs font-semibold ${statusInfo.color}`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
              {category && (
                <span className="text-xs text-muted-foreground">
                  · {category}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {owner && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {owner.avatar ? (
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-primary">
                    {owner.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-4 mb-4 py-3 border-y bg-muted/30">
          <div className="flex items-center gap-4">
            {membersCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{membersCount}</span>
              </div>
            )}
            {tasksCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{tasksCount}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {startDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(startDate), 'MMM d')}</span>
              </div>
            )}
            {budget && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>${budget.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/projects/${id}`}>
              View Details
            </Link>
          </Button>
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href={`/projects/${id}/tasks`}>
              Tasks
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
