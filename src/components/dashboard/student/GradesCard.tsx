import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, TrendingUp, GraduationCap } from 'lucide-react'

export interface Grade {
  id: string
  courseCode: string
  courseName: string
  grade: string
  credits: number
  semester: string
  year: number
  gpa: number
}

interface GradesCardProps {
  grades: Grade[]
  currentGPA: number
  cumulativeGPA: number
  totalCredits: number
  className?: string
}

export function GradesCard({
  grades,
  currentGPA,
  cumulativeGPA,
  totalCredits,
  className = '',
}: GradesCardProps) {
  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (['C+', 'C', 'C-'].includes(grade)) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const recentGrades = grades.slice(0, 5)

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Academic Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* GPA Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {currentGPA.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Current GPA</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {cumulativeGPA.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Cumulative</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {totalCredits}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Credits</div>
          </div>
        </div>

        {/* Recent Grades */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Grades</span>
          </div>
          <div className="space-y-2">
            {recentGrades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {grade.courseCode}
                    </Badge>
                    <span className="text-sm font-medium line-clamp-1">
                      {grade.courseName}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {grade.semester} {grade.year} · {grade.credits} credits
                  </div>
                </div>
                <Badge className={`text-sm font-bold ${getGradeColor(grade.grade)}`}>
                  {grade.grade}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
