'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Plus, Eye, Users } from 'lucide-react'
import { useState } from 'react'

interface BusinessJobsWidgetProps {
  businessId: string
  jobs: Array<{
    id: string
    title: string
    type: string
    published: boolean
    publishedAt?: string | Date
    _count?: {
      applications: number
    }
  }>
  myRole?: string
  onAddJob?: () => void
  onManageJob?: (jobId: string) => void
}

export function BusinessJobsWidget({
  businessId,
  jobs,
  myRole,
  onAddJob,
  onManageJob,
}: BusinessJobsWidgetProps) {
  const [showAll, setShowAll] = useState(false)

  const canPostJobs = myRole && ['OWNER', 'ADMIN', 'HR_MANAGER', 'RECRUITER'].includes(myRole)

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-blue-500/10 text-blue-700'
      case 'PART_TIME':
        return 'bg-green-500/10 text-green-700'
      case 'INTERNSHIP':
        return 'bg-purple-500/10 text-purple-700'
      case 'CONTRACT':
        return 'bg-orange-500/10 text-orange-700'
      default:
        return 'bg-gray-500/10 text-gray-700'
    }
  }

  const displayJobs = showAll ? jobs : jobs.slice(0, 5)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          Job Postings
        </CardTitle>
        {canPostJobs && (
          <Button size="sm" onClick={onAddJob}>
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No job postings yet</p>
              {canPostJobs && (
                <p className="text-sm mt-2">Click "Post Job" to create your first posting</p>
              )}
            </div>
          ) : (
            displayJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{job.title}</h4>
                    <Badge variant="outline" className={getEmploymentTypeColor(job.type)}>
                      {job.type.replace('_', ' ')}
                    </Badge>
                    {job.published ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job._count?.applications || 0} Applications
                    </span>
                    {job.publishedAt && (
                      <span>Posted {new Date(job.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManageJob?.(job.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        {jobs.length > 5 && !showAll && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
            >
              View All {jobs.length} Jobs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
