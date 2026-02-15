import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, TrendingUp, Users, Eye, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: 'full_time' | 'part_time' | 'contract' | 'internship'
  status: 'active' | 'draft' | 'closed' | 'paused'
  applications: number
  views: number
  postedDate: Date
  deadline?: Date
}

interface JobPostingsProps {
  jobs: JobPosting[]
  totalActive: number
  totalApplications: number
  totalViews: number
  className?: string
}

export function JobPostings({
  jobs,
  totalActive,
  totalApplications,
  totalViews,
  className = '',
}: JobPostingsProps) {
  const typeConfig = {
    full_time: { label: 'Full-time', color: 'bg-blue-100 text-blue-700' },
    part_time: { label: 'Part-time', color: 'bg-amber-100 text-amber-700' },
    contract: { label: 'Contract', color: 'bg-purple-100 text-purple-700' },
    internship: { label: 'Internship', color: 'bg-emerald-100 text-emerald-700' },
  }

  const statusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
    closed: { label: 'Closed', color: 'bg-rose-100 text-rose-700' },
    paused: { label: 'Paused', color: 'bg-amber-100 text-amber-700' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Job Postings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalActive}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active Jobs</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {totalApplications}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Applications</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {totalViews}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Views</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-2">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${statusConfig[job.status].color}`}>
                      {statusConfig[job.status].label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {typeConfig[job.type].label}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold line-clamp-1">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{job.applications} applied</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{job.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No job postings</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
