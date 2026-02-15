import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LineChart, TrendingUp, TrendingDown, Calendar, DollarSign, Percent } from 'lucide-react'

export interface FinancialMetric {
  period: string
  revenue: number
  expenses: number
  profit: number
  roi: number
}

interface FinancialMetricsProps {
  currentMetrics: FinancialMetric
  previousMetrics: FinancialMetric
  totalRevenue: number
  totalProfit: number
  monthlyData: FinancialMetric[]
  className?: string
}

export function FinancialMetrics({
  currentMetrics,
  previousMetrics,
  totalRevenue,
  totalProfit,
  monthlyData,
  className = '',
}: FinancialMetricsProps) {
  const revenueChange = ((currentMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue) * 100
  const profitChange = ((currentMetrics.profit - previousMetrics.profit) / previousMetrics.profit) * 100
  const profitMargin = (currentMetrics.profit / currentMetrics.revenue) * 100

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <LineChart className="w-5 h-5 text-primary" />
          Financial Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Current Month Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {revenueChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span className={`text-xs ${revenueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              ${(currentMetrics.revenue / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground mt-1">Revenue</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {profitChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span className={`text-xs ${profitChange >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              ${(currentMetrics.profit / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground mt-1">Profit</div>
          </div>
        </div>

        {/* YTD Stats */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Year-to-Date</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-primary">${totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Profit</div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-600">${totalProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">Profit Margin</div>
                <div className="text-xs text-muted-foreground">
                  Profit / Revenue ratio
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <Progress value={profitMargin} className="h-2 mt-2" />
        </div>

        {/* Monthly Trend */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Monthly Trend (Last 6 Months)</span>
          </div>
          <div className="space-y-2">
            {monthlyData.slice(0, 6).map((month) => (
              <div
                key={month.period}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{month.period}</div>
                  <div className="text-xs text-muted-foreground">
                    ${(month.expenses / 1000).toFixed(0)}k expenses
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">
                    +${(month.profit / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(month.revenue / 1000).toFixed(0)}k revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
