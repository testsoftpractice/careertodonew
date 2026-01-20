import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Activity, Shield } from 'lucide-react'

export interface PlatformStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  newUsersThisMonth: number
  userGrowthRate: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  premiumSubscribers: number
}

interface PlatformStatisticsProps {
  stats: PlatformStats
  className?: string
}

export function PlatformStatistics({ stats, className = '' }: PlatformStatisticsProps) {
  const activeRate = (stats.activeUsers / stats.totalUsers) * 100
  const premiumRate = (stats.premiumSubscribers / stats.totalUsers) * 100

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Platform Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Users</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active Users</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              +{stats.newUsersToday}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New Today</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              +{stats.newUsersThisMonth}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New This Month</div>
          </div>
        </div>

        {/* Growth & Engagement */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">User Growth</span>
              </div>
              <Badge variant="secondary">{stats.userGrowthRate.toFixed(1)}%</Badge>
            </div>
            <Progress value={Math.min(stats.userGrowthRate, 100)} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Active Rate</span>
              </div>
              <Badge variant="secondary">{activeRate.toFixed(0)}%</Badge>
            </div>
            <Progress value={activeRate} className="h-2" />
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.dailyActiveUsers.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Daily Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.weeklyActiveUsers.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Weekly Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{stats.monthlyActiveUsers.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Monthly Active</div>
            </div>
          </div>
        </div>

        {/* Premium Subscribers */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-sm font-semibold">Premium Subscribers</div>
                <div className="text-xs text-muted-foreground">
                  {stats.premiumSubscribers.toLocaleString()} users
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">
                {premiumRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">conversion rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
