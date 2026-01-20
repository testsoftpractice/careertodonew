import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, TrendingUp, Star } from 'lucide-react'

export interface Department {
  id: string
  name: string
  head: string
  studentsCount: number
  facultyCount: number
  courses: number
  averageRating: number
  budget: number
  spent: number
  performance: number
  growth: number
}

interface DepartmentPerformanceProps {
  departments: Department[]
  className?: string
}

export function DepartmentPerformance({ departments, className = '' }: DepartmentPerformanceProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Department Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {departments.slice(0, 5).map((dept) => (
          <div
            key={dept.id}
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold line-clamp-1">{dept.name}</h4>
                  <Badge
                    variant="outline"
                    className={dept.growth >= 0 ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}
                  >
                    {dept.growth >= 0 ? '+' : ''}{dept.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Head: {dept.head}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-bold">{dept.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{dept.studentsCount}</div>
                <div className="text-[10px] text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{dept.facultyCount}</div>
                <div className="text-[10px] text-muted-foreground">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{dept.courses}</div>
                <div className="text-[10px] text-muted-foreground">Courses</div>
              </div>
            </div>

            {/* Budget & Performance */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Budget Used</span>
                  <span>${(dept.spent / 1000).toFixed(0)}k / ${(dept.budget / 1000).toFixed(0)}k</span>
                </div>
                <Progress value={(dept.spent / dept.budget) * 100} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Performance Score</span>
                  <span>{dept.performance.toFixed(0)}%</span>
                </div>
                <Progress value={dept.performance} className="h-1.5" />
              </div>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No departments found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
