'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, TrendingUp, Calendar, Target, Zap, Trophy, Star, CheckCircle2, Briefcase, Users, GraduationCap, Share2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

interface PointsDashboardProps {
  userId?: string
}

export default function PointsDashboard({ userId }: PointsDashboardProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalEarned: 0,
    breakdown: {} as Record<string, number>,
    thisWeekPoints: 0,
    thisMonthPoints: 0,
  })

  const effectiveUserId = userId || user?.id

  useEffect(() => {
    if (effectiveUserId) {
      fetchStats()
    }
  }, [effectiveUserId])

  const fetchStats = async () => {
    if (!effectiveUserId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/points?userId=${effectiveUserId}&stats=true`)
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch points statistics',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch points stats error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch points statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      BUSINESS_CREATION: 'Business Creation',
      TASK_COMPLETION: 'Task Completion',
      MILESTONE_ACHIEVEMENT: 'Milestone Achievement',
      JOB_APPLICATION: 'Job Application',
      COLLABORATION: 'Collaboration',
      VERIFICATION_APPROVED: 'Verification Approved',
      UNIVERSITY_ACHIEVEMENT: 'University Achievement',
      RATING_RECEIVED: 'Rating Received',
      REFERRAL: 'Referral',
      EVENT_PARTICIPATION: 'Event Participation',
    }
    return labels[source] || source
  }

  const getSourceIcon = (source: string) => {
    const icons: Record<string, any> = {
      BUSINESS_CREATION: Trophy,
      TASK_COMPLETION: CheckCircle2,
      MILESTONE_ACHIEVEMENT: Star,
      JOB_APPLICATION: Briefcase,
      COLLABORATION: Users,
      VERIFICATION_APPROVED: Award,
      UNIVERSITY_ACHIEVEMENT: GraduationCap,
      RATING_RECEIVED: Star,
      REFERRAL: Share2,
      EVENT_PARTICIPATION: Calendar,
    }
    return icons[source] || Zap
  }

  const breakdownArray = Object.entries(stats.breakdown)
    .map(([source, points]) => ({ source, points }))
    .sort((a, b) => b.points - a.points)

  const maxBreakdownPoints = breakdownArray[0]?.points || 0

  const getLevel = (points: number) => {
    if (points >= 5000) return { level: 'Platinum', color: 'bg-purple-500', progress: 100 }
    if (points >= 2500) return { level: 'Gold', color: 'bg-yellow-500', progress: ((points - 2500) / 2500) * 100 }
    if (points >= 1000) return { level: 'Silver', color: 'bg-gray-400', progress: ((points - 1000) / 1500) * 100 }
    if (points >= 500) return { level: 'Bronze', color: 'bg-orange-600', progress: ((points - 500) / 500) * 100 }
    return { level: 'Starter', color: 'bg-blue-500', progress: (points / 500) * 100 }
  }

  const level = getLevel(stats.totalPoints)

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Total Points
            </CardTitle>
            <CardDescription>Your overall achievement score</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-5xl font-bold">{stats.totalPoints.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <Badge className={level.color}>{level.level}</Badge>
                  <span className="text-sm text-muted-foreground">Level</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress to next level</span>
                    <span className="text-sm text-muted-foreground">{Math.round(level.progress)}%</span>
                  </div>
                  <Progress value={level.progress} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              This Week
            </CardTitle>
            <CardDescription>Points earned this week</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">{stats.thisWeekPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">points this week</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              This Month
            </CardTitle>
            <CardDescription>Points earned this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">{stats.thisMonthPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">points this month</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Points Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Points Breakdown
          </CardTitle>
          <CardDescription>Points earned by activity type</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Zap className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading breakdown...</p>
            </div>
          ) : breakdownArray.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No points earned yet. Start completing activities to earn points!
            </div>
          ) : (
            <div className="space-y-4">
              {breakdownArray.map(({ source, points }) => {
                const Icon = getSourceIcon(source)
                const percentage = maxBreakdownPoints > 0 ? (points / maxBreakdownPoints) * 100 : 0

                return (
                  <div key={source} className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{getSourceLabel(source)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{points} pts</Badge>
                        <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
