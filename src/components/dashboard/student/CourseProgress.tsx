import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export interface Course {
  id: string
  code: string
  name: string
  instructor: string
  progress: number
  grade?: string
  credits: number
  status: 'in_progress' | 'completed' | 'upcoming'
  nextAssignment?: Date
}

interface CourseProgressProps {
  courses: Course[]
  maxCourses?: number
  className?: string
}

export function CourseProgress({ courses, maxCourses = 4, className = '' }: CourseProgressProps) {
  const displayCourses = courses.slice(0, maxCourses)

  const statusConfig = {
    in_progress: { icon: Clock, label: 'In Progress', color: 'text-blue-500' },
    completed: { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-500' },
    upcoming: { icon: AlertCircle, label: 'Upcoming', color: 'text-amber-500' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Course Progress
          </div>
          {courses.length > maxCourses && (
            <Badge variant="secondary" className="text-xs">
              +{courses.length - maxCourses} more
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 sm:space-y-4">
        {displayCourses.map((course) => {
          const StatusIcon = statusConfig[course.status].icon
          const statusInfo = statusConfig[course.status]

          return (
            <div
              key={course.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {course.code}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold line-clamp-1">{course.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                </div>
                {course.grade && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{course.grade}</div>
                    <div className="text-xs text-muted-foreground">{course.credits} credits</div>
                  </div>
                )}
              </div>

              {course.status === 'in_progress' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(course.progress)}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
              )}
            </div>
          )
        })}
        {displayCourses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No courses enrolled
          </div>
        )}
      </CardContent>
    </Card>
  )
}
