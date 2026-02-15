import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User } from 'lucide-react'

export interface ScheduleItem {
  id: string
  courseCode: string
  courseName: string
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  location: string
  instructor: string
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar'
}

interface ScheduleCardProps {
  schedule: ScheduleItem[]
  showToday?: boolean
  className?: string
}

export function ScheduleCard({ schedule, showToday = false, className = '' }: ScheduleCardProps) {
  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

  const typeConfig = {
    lecture: { label: 'Lecture', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    lab: { label: 'Lab', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
    tutorial: { label: 'Tutorial', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    seminar: { label: 'Seminar', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  }

  const filteredSchedule = showToday
    ? schedule.filter(item => item.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase())
    : schedule

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {showToday ? "Today's Schedule" : 'Weekly Schedule'}
          </div>
          {showToday && (
            <Badge variant="secondary" className="text-xs">
              {filteredSchedule.length} classes
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 sm:space-y-3">
        {filteredSchedule
          .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime))
          .slice(0, 6)
          .map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${typeConfig[item.type].color}`}>
                      {typeConfig[item.type].label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.courseCode}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold line-clamp-1">{item.courseName}</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.startTime} - {item.endTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{item.instructor}</span>
              </div>
            </div>
          ))}

        {filteredSchedule.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {showToday ? 'No classes scheduled for today' : 'No classes scheduled'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
