import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export interface FundingSource {
  id: string
  name: string
  type: 'government' | 'private' | 'corporate' | 'grant'
  amount: number
  spent: number
  year: number
  growth: number
}

interface FundingOverviewProps {
  totalFunding: number
  totalSpent: number
  annualBudget: number
  revenue: number
  expenses: number
  sources: FundingSource[]
  className?: string
}

export function FundingOverview({
  totalFunding,
  totalSpent,
  annualBudget,
  revenue,
  expenses,
  sources,
  className = '',
}: FundingOverviewProps) {
  const budgetUtilization = (totalSpent / totalFunding) * 100
  const profitMargin = ((revenue - expenses) / revenue) * 100

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Funding Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              ${(totalFunding / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Funding</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              ${(totalSpent / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Utilized</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              ${(revenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Revenue</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              ${(expenses / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Expenses</div>
          </div>
        </div>

        {/* Budget Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Budget Utilization</span>
            </div>
            <Badge variant="secondary">{budgetUtilization.toFixed(0)}%</Badge>
          </div>
          <Progress value={Math.min(budgetUtilization, 100)} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>${(totalSpent / 1000000).toFixed(1)}M spent</span>
            <span>${(totalFunding / 1000000).toFixed(1)}M total</span>
          </div>
        </div>

        {/* Profit Margin */}
        {profitMargin >= 0 ? (
          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold">Profit Margin</div>
                  <div className="text-xs text-muted-foreground">Revenue - Expenses</div>
                </div>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                +{profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="text-sm font-semibold">Loss Margin</div>
                  <div className="text-xs text-muted-foreground">Revenue - Expenses</div>
                </div>
              </div>
              <span className="text-2xl font-bold text-rose-600">
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Funding Sources */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Funding Sources</span>
          </div>
          <div className="space-y-2">
            {sources.slice(0, 4).map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{source.name}</div>
                  <div className="text-xs text-muted-foreground">{source.year}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    ${(source.amount / 1000).toFixed(0)}k
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${source.growth >= 0 ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}`}
                  >
                    {source.growth >= 0 ? '+' : ''}{source.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
