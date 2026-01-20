import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react'

export interface StudentStats {
  totalStudents: number
  activeStudents: number
  newEnrollments: number
  graduationRate: number
  avgGPA: number
  topPerformers: number
  departments: {
    name: string
    studentCount: number
    growth: number
  }[]
}

interface UniversityStudentStatsProps {
  stats: StudentStats
  className?: string
}

export function UniversityStudentStats({ stats, className = '' }: UniversityStudentStatsProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Student Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Students</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {stats.activeStudents.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              +{stats.newEnrollments}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New This Month</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {stats.avgGPA.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg GPA</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Graduation Rate</span>
              </div>
              <Badge variant="secondary">{stats.graduationRate.toFixed(0)}%</Badge>
            </div>
            <Progress value={stats.graduationRate} className="h-2" />
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold">Top Performers</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {stats.topPerformers}
              </span>
            </div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Departments</span>
          </div>
          <div className="space-y-2">
            {stats.departments.slice(0, 4).map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{dept.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {dept.studentCount} students
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={dept.growth >= 0 ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}
                >
                  {dept.growth >= 0 ? '+' : ''}{dept.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
