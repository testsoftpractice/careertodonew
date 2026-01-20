import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Rocket, TrendingUp, TrendingDown, DollarSign, Calendar, Users } from 'lucide-react'

export interface Startup {
  id: string
  name: string
  industry: string
  stage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'ipo'
  investment: number
  currentValue: number
  roi: number
  monthlyGrowth: number
  employees: number
  foundedYear: number
  lastFunding: Date
  status: 'performing' | 'neutral' | 'underperforming'
}

interface StartupTrackerProps {
  startups: Startup[]
  totalInvested: number
  totalCurrentValue: number
  avgROI: number
  className?: string
}

export function StartupTracker({
  startups,
  totalInvested,
  totalCurrentValue,
  avgROI,
  className = '',
}: StartupTrackerProps) {
  const stageConfig = {
    seed: { label: 'Seed', color: 'bg-blue-100 text-blue-700' },
    series_a: { label: 'Series A', color: 'bg-emerald-100 text-emerald-700' },
    series_b: { label: 'Series B', color: 'bg-amber-100 text-amber-700' },
    series_c: { label: 'Series C', color: 'bg-purple-100 text-purple-700' },
    ipo: { label: 'IPO', color: 'bg-pink-100 text-pink-700' },
  }

  const getStatusColor = (status: string) => {
    if (status === 'performing') return 'text-emerald-600'
    if (status === 'neutral') return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Startup Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {startups.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Startups</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {avgROI.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg ROI</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              ${(totalCurrentValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Value</div>
          </div>
        </div>

        {/* Startups List */}
        <div className="space-y-2">
          {startups.slice(0, 5).map((startup) => {
            const stageInfo = stageConfig[startup.stage]
            const statusColor = getStatusColor(startup.status)
            const isPositive = startup.roi >= 0

            return (
              <div
                key={startup.id}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${stageInfo.color}`}>
                        {stageInfo.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${startup.monthlyGrowth >= 0 ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}`}
                      >
                        {startup.monthlyGrowth >= 0 ? '+' : ''}{startup.monthlyGrowth.toFixed(1)}% / mo
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold line-clamp-1">{startup.name}</h4>
                    <p className="text-xs text-muted-foreground">{startup.industry}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                      )}
                      <span className={`text-lg font-bold ${statusColor}`}>
                        {isPositive ? '+' : ''}{startup.roi.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>${(startup.currentValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{startup.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Since {startup.foundedYear}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {startups.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Rocket className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No startup investments</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
