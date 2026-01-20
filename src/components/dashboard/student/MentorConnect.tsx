import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, MessageSquare, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export interface Mentor {
  id: string
  name: string
  avatar?: string
  title: string
  company: string
  expertise: string[]
  availability: 'available' | 'busy' | 'offline'
  meetingsCount: number
  rating: number
  nextMeeting?: Date
}

interface MentorConnectProps {
  mentors: Mentor[]
  className?: string
}

export function MentorConnect({ mentors, className = '' }: MentorConnectProps) {
  const availabilityConfig = {
    available: { color: 'bg-emerald-500', label: 'Available' },
    busy: { color: 'bg-amber-500', label: 'Busy' },
    offline: { color: 'bg-slate-500', label: 'Offline' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Mentor Connect
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {mentors.slice(0, 4).map((mentor) => {
          const availability = availabilityConfig[mentor.availability]

          return (
            <div
              key={mentor.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    {mentor.avatar ? (
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {mentor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${availability.color}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-sm font-semibold line-clamp-1">{mentor.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {mentor.title} at {mentor.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {mentor.rating} ★
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {mentor.expertise.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {mentor.nextMeeting && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Next: {new Date(mentor.nextMeeting).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs" asChild>
                  <Link href={`/mentors/${mentor.id}/schedule`}>
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Schedule
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}

        {mentors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No mentors connected</p>
            <p className="text-xs mt-1">Find mentors in your field!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
