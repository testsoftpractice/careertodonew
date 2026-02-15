import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'

export interface PortfolioAsset {
  id: string
  name: string
  type: 'equity' | 'debt' | 'real_estate' | 'startup' | 'crypto'
  value: number
  invested: number
  roi: number
  status: 'performing' | 'neutral' | 'underperforming'
}

interface PortfolioOverviewProps {
  totalValue: number
  totalInvested: number
  totalROI: number
  monthlyReturn: number
  assets: PortfolioAsset[]
  className?: string
}

export function PortfolioOverview({
  totalValue,
  totalInvested,
  totalROI,
  monthlyReturn,
  assets,
  className = '',
}: PortfolioOverviewProps) {
  const roiPercentage = ((totalValue - totalInvested) / totalInvested) * 100

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              ${(totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Value</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              +${totalROI.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Returns</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {roiPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">ROI</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 flex items-center justify-center gap-1">
              {monthlyReturn >= 0 ? <TrendingUp /> : <TrendingDown />}
              {monthlyReturn >= 0 ? '+' : ''}{monthlyReturn.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Monthly</div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Asset Allocation</span>
            </div>
          </div>
          <div className="space-y-2">
            {assets.slice(0, 4).map((asset) => {
              const allocation = (asset.value / totalValue) * 100
              const isPositive = asset.roi >= 0

              return (
                <div key={asset.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{asset.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {asset.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${isPositive ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}`}
                      >
                        {isPositive ? '+' : ''}{asset.roi.toFixed(1)}%
                      </Badge>
                      <span className="text-sm font-bold">${(asset.value / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <Progress value={allocation} className="h-1.5" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Total Investment Progress */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">Portfolio Growth</div>
                <div className="text-xs text-muted-foreground">
                  ${totalInvested.toLocaleString()} invested → ${totalValue.toLocaleString()} current
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {roiPercentage >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span className={`text-lg font-bold ${roiPercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {roiPercentage >= 0 ? '+' : ''}{roiPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
