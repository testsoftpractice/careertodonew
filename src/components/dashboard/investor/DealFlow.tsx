import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Handshake, TrendingUp, DollarSign, Calendar, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'

export interface Deal {
  id: string
  startupName: string
  industry: string
  stage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth'
  amount: number
  equity: number
  status: 'negotiating' | 'diligence' | 'pending' | 'closed' | 'passed'
  valuation: number
  expectedROI: number
  createdAt: Date
}

interface DealFlowProps {
  deals: Deal[]
  totalDeals: number
  activeDeals: number
  pipelineValue: number
  className?: string
}

export function DealFlow({
  deals,
  totalDeals,
  activeDeals,
  pipelineValue,
  className = '',
}: DealFlowProps) {
  const stageConfig = {
    seed: { label: 'Seed', color: 'bg-blue-100 text-blue-700' },
    series_a: { label: 'Series A', color: 'bg-emerald-100 text-emerald-700' },
    series_b: { label: 'Series B', color: 'bg-amber-100 text-amber-700' },
    series_c: { label: 'Series C', color: 'bg-purple-100 text-purple-700' },
    growth: { label: 'Growth', color: 'bg-pink-100 text-pink-700' },
  }

  const statusConfig = {
    negotiating: { label: 'Negotiating', color: 'bg-amber-100 text-amber-700' },
    diligence: { label: 'Due Diligence', color: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700' },
    closed: { label: 'Closed', color: 'bg-emerald-100 text-emerald-700' },
    passed: { label: 'Passed', color: 'bg-rose-100 text-rose-700' },
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Handshake className="w-5 h-5 text-primary" />
          Deal Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalDeals}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Deals</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {activeDeals}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              ${(pipelineValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Pipeline Value</div>
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-2">
          {deals.slice(0, 5).map((deal) => {
            const stageInfo = stageConfig[deal.stage]
            const statusInfo = statusConfig[deal.status]

            return (
              <div
                key={deal.id}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${stageInfo.color}`}>
                        {stageInfo.label}
                      </Badge>
                      <Badge className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold line-clamp-1">{deal.startupName}</h4>
                    <p className="text-xs text-muted-foreground">{deal.industry}</p>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Investment</div>
                    <div className="text-sm font-semibold">${(deal.amount / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Equity</div>
                    <div className="text-sm font-semibold">{deal.equity}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Valuation</div>
                    <div className="text-sm font-semibold">${(deal.valuation / 1000000).toFixed(1)}M</div>
                  </div>
                </div>

                {/* Expected ROI */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Expected ROI</span>
                    </div>
                    <span className="font-semibold text-primary">{deal.expectedROI.toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(deal.expectedROI, 100)} className="h-1.5" />
                </div>
              </div>
            )
          })}
        </div>

        {deals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Handshake className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active deals</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
