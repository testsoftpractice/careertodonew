import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

export interface PipelineStage {
  name: string
  count: number
  percentage: number
  avgTime: string
}

interface HiringPipelineProps {
  stages: PipelineStage[]
  totalCandidates: number
  avgTimeToHire: number
  offerAcceptanceRate: number
  className?: string
}

export function HiringPipeline({
  stages,
  totalCandidates,
  avgTimeToHire,
  offerAcceptanceRate,
  className = '',
}: HiringPipelineProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          Hiring Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {totalCandidates}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Candidates</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {avgTimeToHire}d
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Time to Hire</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {offerAcceptanceRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Offer Acceptance</div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{stage.name}</div>
                    <div className="text-xs text-muted-foreground">{stage.avgTime} avg</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{stage.count}</div>
                  <div className="text-xs text-muted-foreground">
                    {stage.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <Progress value={stage.percentage} className="h-2" />
            </div>
          ))}
        </div>

        {/* Conversion Funnel */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-sm font-semibold">Pipeline Efficiency</div>
                <div className="text-xs text-muted-foreground">
                  {stages[stages.length - 1]?.count || 0} / {totalCandidates} candidates hired
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {totalCandidates > 0
                ? ((stages[stages.length - 1]?.count || 0) / totalCandidates * 100).toFixed(0)
                : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
