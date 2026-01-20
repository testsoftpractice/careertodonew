import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, FileText, BookOpen } from 'lucide-react'

export interface Deadline {
  id: string
  title: string
  type: 'assignment' | 'project' | 'exam' | 'task'
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  course?: string
  status: 'pending' | 'in_progress' | 'submitted'
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[]
  className?: string
}

export function UpcomingDeadlines({ deadlines, className = '' }: UpcomingDeadlinesProps) {
  const typeConfig = {
    assignment: { icon: FileText, label: 'Assignment', color: 'bg-blue-100 text-blue-700' },
    project: { icon: BookOpen, label: 'Project', color: 'bg-purple-100 text-purple-700' },
    exam: { icon: AlertTriangle, label: 'Exam', color: 'bg-rose-100 text-rose-700' },
    task: { icon: Clock, label: 'Task', color: 'bg-emerald-100 text-emerald-700' },
  }

  const priorityConfig = {
    high: { color: 'bg-rose-500', label: 'High' },
    medium: { color: 'bg-amber-500', label: 'Medium' },
    low: { color: 'bg-emerald-500', label: 'Low' },
  }

  const getDueText = (dueDate: Date) => {
    const now = new Date()
    const diff = dueDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { text: 'Overdue', color: 'text-rose-600' }
    if (days === 0) return { text: 'Today', color: 'text-orange-600' }
    if (days === 1) return { text: 'Tomorrow', color: 'text-amber-600' }
    if (days <= 7) return { text: `In ${days} days`, color: 'text-blue-600' }
    return { text: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-muted-foreground' }
  }

  const sortedDeadlines = deadlines
    .filter(d => d.status !== 'submitted')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6)

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Deadlines
          </div>
          {deadlines.length > 6 && (
            <Badge variant="secondary" className="text-xs">
              +{deadlines.length - 6} more
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 sm:space-y-3">
        {sortedDeadlines.map((deadline) => {
          const typeInfo = typeConfig[deadline.type]
          const TypeIcon = typeInfo.icon
          const priorityInfo = priorityConfig[deadline.priority]
          const dueInfo = getDueText(deadline.dueDate)

          return (
            <div
              key={deadline.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${typeInfo.color}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                    </div>
                    <Badge className={`text-[10px] ${priorityInfo.color} text-white`}>
                      {priorityInfo.label}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold line-clamp-1">{deadline.title}</h4>
                  {deadline.course && (
                    <p className="text-xs text-muted-foreground mt-0.5">{deadline.course}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold ${dueInfo.color}`}>
                  {dueInfo.text}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(deadline.dueDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {sortedDeadlines.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming deadlines</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
