import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Award, Zap } from 'lucide-react'

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  endorsements: number
  verified: boolean
  projects: number
}

interface SkillsMatrixProps {
  skills: Skill[]
  totalSkills: number
  totalEndorsements: number
  topSkill?: Skill
  className?: string
}

export function SkillsMatrix({
  skills,
  totalSkills,
  totalEndorsements,
  topSkill,
  className = '',
}: SkillsMatrixProps) {
  const skillCategories = ['Technical', 'Design', 'Business', 'Soft Skills']
  const categoryColors = {
    'Technical': 'bg-blue-500/10 text-blue-600 border-blue-200',
    'Design': 'bg-purple-500/10 text-purple-600 border-purple-200',
    'Business': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    'Soft Skills': 'bg-amber-500/10 text-amber-600 border-amber-200',
  }

  const displaySkills = skills.slice(0, 8)

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skills Matrix
          </div>
          <Badge variant="secondary" className="text-xs">
            {totalSkills} skills
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalSkills}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Skills</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {totalEndorsements}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Endorsements</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">
              {skills.filter(s => s.verified).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Verified</div>
          </div>
        </div>

        {/* Top Skill Highlight */}
        {topSkill && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold">Top Skill</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold">{topSkill.name}</div>
                <div className="text-xs text-muted-foreground">
                  {topSkill.endorsements} endorsements · {topSkill.projects} projects
                </div>
              </div>
              <Badge variant="outline" className="text-sm font-bold">
                Level {topSkill.level}
              </Badge>
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="space-y-3">
          {displaySkills.map((skill) => {
            const colorClass = categoryColors[skill.category] || categoryColors['Technical']

            return (
              <div
                key={skill.id}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold line-clamp-1">{skill.name}</h4>
                      {skill.verified && (
                        <Award className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-[10px] ${colorClass}`}>
                        {skill.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {skill.endorsements} endorsements
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    Level {skill.level}
                  </Badge>
                </div>
                <Progress value={(skill.level / 10) * 100} className="h-1.5" />
              </div>
            )
          })}
        </div>

        {displaySkills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No skills added yet</p>
            <p className="text-xs mt-1">Add your skills to showcase expertise!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
