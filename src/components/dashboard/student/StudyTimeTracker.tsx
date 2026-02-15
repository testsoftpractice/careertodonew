import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Timer, TrendingUp, Target, Flame } from 'lucide-react'

export interface StudySession {
  id: string
  date: string
  duration: number
  subject: string
  focusScore: number
}

interface StudyTimeTrackerProps {
  totalHours: number
  weeklyGoal: number
  weeklyHours: number
  todayHours: number
  sessions: StudySession[]
  streakDays: number
  className?: string
}

export function StudyTimeTracker({
  totalHours,
  weeklyGoal,
  weeklyHours,
  todayHours,
  sessions,
  streakDays,
  className = '',
}: StudyTimeTrackerProps) {
  const weeklyProgress = (weeklyHours / weeklyGoal) * 100
  const avgFocusScore = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length
    : 0

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          Study Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalHours.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Hours</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6" />
              {streakDays}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {todayHours.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Today</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {avgFocusScore.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Focus</div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {weeklyHours.toFixed(1)} / {weeklyGoal}h
            </Badge>
          </div>
          <Progress value={Math.min(weeklyProgress, 100)} className="h-2" />
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Sessions</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{session.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{session.duration}h</div>
                  <div className="text-xs text-muted-foreground">
                    {session.focusScore}% focus
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No study sessions recorded
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
