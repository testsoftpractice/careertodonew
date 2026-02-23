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
  Edit,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface ProjectCardProps {
  id: string
  name: string
  description?: string
  status?: string
  approvalStatus?: string
  reviewComments?: string | null
  startDate?: Date | string
  endDate?: Date | string
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

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  IDEA: { label: 'Idea', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700', icon: '📝' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900', icon: '🔍' },
  FUNDING: { label: 'Funding', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900', icon: '💰' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900', icon: '🚀' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900', icon: '✅' },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900', icon: '❌' },
  ON_HOLD: { label: 'On Hold', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700', icon: '⏸' },
  ACTIVE: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900', icon: '🚀' },
  RECRUITING: { label: 'Recruiting', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900', icon: '👥' },
}

const approvalStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pending Approval', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', icon: '⏳' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', icon: '🔍' },
  APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', icon: '✅' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', icon: '❌' },
  REQUIRE_CHANGES: { label: 'Changes Needed', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', icon: '⚠️' },
}

export function ProjectCard({
  id,
  name,
  description,
  status,
  approvalStatus,
  reviewComments,
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
  // Get status info with fallback for unknown status
  const statusInfo = statusConfig[status || ''] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: '📋' }
  const approvalInfo = approvalStatus ? (approvalStatusConfig[approvalStatus] || { label: approvalStatus, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: '📋' }) : null

  // If project is pending approval, show approval status instead of project status
  const showApprovalStatus = approvalStatus && (approvalStatus === 'PENDING' || approvalStatus === 'UNDER_REVIEW' || approvalStatus === 'REJECTED' || approvalStatus === 'REQUIRE_CHANGES')
  
  // Special handling for REQUIRE_CHANGES status
  const needsChanges = approvalStatus === 'REQUIRE_CHANGES'
  const isRejected = approvalStatus === 'REJECTED'

  return (
    <Card className={`${className} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${needsChanges ? 'border-orange-300 dark:border-orange-700' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {showApprovalStatus && approvalInfo ? (
                <Badge className={`text-xs font-semibold ${approvalInfo.color}`}>
                  <span className="mr-1">{approvalInfo.icon}</span>
                  {approvalInfo.label}
                </Badge>
              ) : (
                <Badge className={`text-xs font-semibold ${statusInfo.color}`}>
                  <span className="mr-1">{statusInfo.icon}</span>
                  {statusInfo.label}
                </Badge>
              )}
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
                    {owner.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Show feedback alert for projects that need changes */}
        {needsChanges && reviewComments && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-1">
                  Admin Feedback:
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 line-clamp-2">
                  {reviewComments}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Show rejection reason */}
        {isRejected && reviewComments && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-1">
                  Rejection Reason:
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 line-clamp-2">
                  {reviewComments}
                </p>
              </div>
            </div>
          </div>
        )}

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
          {needsChanges || isRejected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/projects/${id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href={`/projects/${id}/edit`}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit & Resubmit
                </Link>
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
