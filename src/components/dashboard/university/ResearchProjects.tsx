import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FlaskConical, Users, DollarSign, TrendingUp, BookOpen } from 'lucide-react'
import Link from 'next/link'

export interface ResearchProject {
  id: string
  title: string
  principalInvestigator: string
  department: string
  budget: number
  spent: number
  startDate: Date
  endDate: Date
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  teamSize: number
  publications: number
  progress: number
}

interface ResearchProjectsProps {
  projects: ResearchProject[]
  totalProjects: number
  activeFunding: number
  publicationsCount: number
  className?: string
}

export function ResearchProjects({
  projects,
  totalProjects,
  activeFunding,
  publicationsCount,
  className = '',
}: ResearchProjectsProps) {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
    on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Research Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalProjects}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              ${(activeFunding / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground mt-1">Funding</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {publicationsCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Publications</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3">
          {projects.slice(0, 4).map((project) => {
            const statusInfo = statusConfig[project.status]

            return (
              <div
                key={project.id}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold line-clamp-1">{project.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PI: {project.principalInvestigator}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                {project.status === 'active' && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{Math.round(project.progress)}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>${(project.budget / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{project.teamSize}</span>
                    </div>
                    {project.publications > 0 && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{project.publications}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No research projects</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
