import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Award, Calendar } from 'lucide-react'

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: string
  department: string
  projects: number
  performance: number
  hireDate: Date
  status: 'active' | 'on_leave' | 'inactive'
}

interface TeamPerformanceProps {
  members: TeamMember[]
  totalMembers: number
  avgPerformance: number
  activeProjects: number
  className?: string
}

export function TeamPerformance({
  members,
  totalMembers,
  avgPerformance,
  activeProjects,
  className = '',
}: TeamPerformanceProps) {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    on_leave: { label: 'On Leave', color: 'bg-amber-100 text-amber-700' },
    inactive: { label: 'Inactive', color: 'bg-rose-100 text-rose-700' },
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalMembers}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Team Members</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {avgPerformance.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Performance</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {activeProjects}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active Projects</div>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Top Performers</span>
          </div>
          <div className="space-y-2">
            {members
              .sort((a, b) => b.performance - a.performance)
              .slice(0, 4)
              .map((member) => {
                const statusInfo = statusConfig[member.status]
                const performanceColor = getPerformanceColor(member.performance)

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold line-clamp-1">{member.name}</h4>
                          <Badge className={`text-[10px] ${statusInfo.color}`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {member.role} · {member.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className={`text-lg font-bold ${performanceColor}`}>
                        {member.performance}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {member.projects} projects
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Recent Hires */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Hires</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {members
              .filter(m => {
                const daysSinceHire = (new Date().getTime() - new Date(m.hireDate).getTime()) / (1000 * 60 * 60 * 24)
                return daysSinceHire <= 30
              })
              .slice(0, 4)
              .map((member) => (
                <Avatar key={member.id} className="w-8 h-8">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            {members.filter(m => {
              const daysSinceHire = (new Date().getTime() - new Date(m.hireDate).getTime()) / (1000 * 60 * 60 * 24)
              return daysSinceHire <= 30
            }).length === 0 && (
              <span className="text-xs text-muted-foreground">No new hires in the last 30 days</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
