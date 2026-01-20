import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: 'trophy' | 'medal' | 'award' | 'star'
  category: 'academic' | 'project' | 'leadership' | 'collaboration' | 'milestone'
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementBadgesProps {
  achievements: Achievement[]
  totalUnlocked: number
  totalAvailable: number
  className?: string
}

export function AchievementBadges({
  achievements,
  totalUnlocked,
  totalAvailable,
  className = '',
}: AchievementBadgesProps) {
  const iconMap = {
    trophy: Trophy,
    medal: Medal,
    award: Award,
    star: Star,
  }

  const rarityConfig = {
    common: { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-300' },
    rare: { bg: 'bg-blue-100 text-blue-700', border: 'border-blue-300' },
    epic: { bg: 'bg-purple-100 text-purple-700', border: 'border-purple-300' },
    legendary: { bg: 'bg-amber-100 text-amber-700', border: 'border-amber-300' },
  }

  const categoryColors = {
    academic: 'bg-blue-500/10 text-blue-600',
    project: 'bg-emerald-500/10 text-emerald-600',
    leadership: 'bg-amber-500/10 text-amber-600',
    collaboration: 'bg-purple-500/10 text-purple-600',
    milestone: 'bg-pink-500/10 text-pink-600',
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </div>
          <Badge variant="secondary" className="text-xs">
            {totalUnlocked} / {totalAvailable}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Progress */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Unlocked</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {Math.round((totalUnlocked / totalAvailable) * 100)}%
            </span>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.slice(0, 6).map((achievement) => {
            const Icon = iconMap[achievement.icon]
            const rarity = rarityConfig[achievement.rarity]

            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border-2 ${rarity.bg} ${rarity.border} hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-2 rounded-full ${rarity.bg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-semibold line-clamp-1">{achievement.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[achievement.category]}`}>
                    {achievement.category}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Achievement */}
        {achievements.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Latest Achievement</span>
                  <Badge variant="outline" className="text-xs">
                    {achievements[0].rarity}
                  </Badge>
                </div>
                <p className="text-sm font-medium line-clamp-1">{achievements[0].title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {achievements[0].description}
                </p>
              </div>
            </div>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No achievements unlocked yet</p>
            <p className="text-xs mt-1">Complete tasks to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
