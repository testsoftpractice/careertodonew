'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  ArrowRight,
  Loader2,
  Star,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'

interface StudentRanking {
  rank: number
  id: string
  name: string
  university?: string
  score: number
}

interface LeaderboardPreviewProps {
  compact?: boolean
}

export function LeaderboardPreview({ compact = false }: LeaderboardPreviewProps) {
  const [topStudents, setTopStudents] = useState<StudentRanking[]>([])
  const [userRank, setUserRank] = useState<StudentRanking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboards?category=students&limit=5')
        const data = await response.json()

        if (data.success) {
          const students = data.data.users || []

          // Get top 5 students
          const top5 = students.slice(0, 5).map((s: any) => ({
            rank: s.rank,
            id: s.id,
            name: s.name,
            university: s.university,
            score: s.overallReputation || 0,
          }))

          setTopStudents(top5)

          // Try to find current user's rank (not in top 5)
          // This would require fetching more data in production
        }
      } catch (error) {
        console.error('Fetch leaderboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />
    return null
  }

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Leaderboards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {topStudents.slice(0, 3).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
                >
                  <div className="flex items-center gap-1 w-12">
                    <span className={`text-sm font-bold ${
                      student.rank === 1 ? 'text-yellow-600' :
                      student.rank === 2 ? 'text-gray-500' :
                      student.rank === 3 ? 'text-amber-600' : ''
                    }`}>
                      #{student.rank}
                    </span>
                    {getRankIcon(student.rank)}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {student.name?.split(' ').map(n => n[0]).join('') || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.university || ''}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{student.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href="/leaderboards">
                  View Full Rankings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Leaderboards
            </CardTitle>
            <CardDescription>
              Top performers across the platform
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/leaderboards">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  student.rank === 1
                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-300 dark:border-yellow-700'
                    : student.rank === 2
                    ? 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-300 dark:border-gray-700'
                    : student.rank === 3
                    ? 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-300 dark:border-orange-700'
                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 w-16">
                  <span className={`text-xl font-bold ${
                    student.rank <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                  }`}>
                    #{student.rank}
                  </span>
                  {getRankIcon(student.rank)}
                </div>

                <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700">
                  <AvatarFallback className="text-sm">
                    {student.name?.split(' ').map(n => n[0]).join('') || 'S'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{student.name}</p>
                  {student.university && (
                    <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {student.university}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-right">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold">{student.score.toFixed(1)}</span>
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            ))}

            {userRank && userRank.rank > 5 && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Your Rank: #{userRank.rank}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{userRank.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/leaderboards">
                      Improve Your Score
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
