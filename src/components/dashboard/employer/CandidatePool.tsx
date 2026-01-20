import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UserCheck, User, Filter, ArrowUpRight, Clock } from 'lucide-react'
import Link from 'next/link'

export interface Application {
  id: string
  candidate: {
    name: string
    email: string
    avatar?: string
  }
  position: string
  status: 'new' | 'review' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: Date
  matchScore: number
  experience: number
  skills: string[]
}

interface CandidatePoolProps {
  applications: Application[]
  totalApplications: number
  newApplications: number
  inReview: number
  hired: number
  avgMatchScore: number
  className?: string
}

export function CandidatePool({
  applications,
  totalApplications,
  newApplications,
  inReview,
  hired,
  avgMatchScore,
  className = '',
}: CandidatePoolProps) {
  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'In Review', color: 'bg-amber-100 text-amber-700' },
    interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700' },
    offer: { label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
    hired: { label: 'Hired', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          Candidate Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {totalApplications}
            </div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {newApplications}
            </div>
            <div className="text-[10px] text-muted-foreground">New</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">
              {inReview}
            </div>
            <div className="text-[10px] text-muted-foreground">Review</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {hired}
            </div>
            <div className="text-[10px] text-muted-foreground">Hired</div>
          </div>
        </div>

        {/* Avg Match Score */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Avg Match Score</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-2xl font-bold text-primary">
                {avgMatchScore.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-2">
          {applications.slice(0, 5).map((app) => {
            const statusInfo = statusConfig[app.status]

            return (
              <div
                key={app.id}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {app.matchScore.toFixed(0)}% match
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold line-clamp-1">{app.candidate.name}</h4>
                    <p className="text-xs text-muted-foreground">{app.position}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {app.skills.slice(0, 4).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(app.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{app.experience}y exp</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No candidates yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
