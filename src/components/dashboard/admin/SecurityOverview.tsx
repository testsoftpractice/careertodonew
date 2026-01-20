import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, XCircle, CheckCircle2, Clock } from 'lucide-react'

export interface SecurityAlert {
  id: string
  type: 'sql_injection' | 'xss' | 'auth_failure' | 'rate_limit' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  source: string
  timestamp: Date
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
}

interface SecurityOverviewProps {
  alerts: SecurityAlert[]
  totalAlerts: number
  criticalAlerts: number
  highAlerts: number
  resolvedToday: number
  className?: string
}

export function SecurityOverview({
  alerts,
  totalAlerts,
  criticalAlerts,
  highAlerts,
  resolvedToday,
  className = '',
}: SecurityOverviewProps) {
  const severityConfig = {
    low: { label: 'Low', color: 'bg-blue-100 text-blue-700' },
    medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
    critical: { label: 'Critical', color: 'bg-rose-100 text-rose-700' },
  }

  const statusConfig = {
    open: { label: 'Open', color: 'bg-rose-100 text-rose-700' },
    investigating: { label: 'Investigating', color: 'bg-amber-100 text-amber-700' },
    resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
    false_positive: { label: 'False Positive', color: 'bg-slate-100 text-slate-700' },
  }

  const openAlerts = alerts.filter(a => a.status === 'open')

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {totalAlerts}
            </div>
            <div className="text-[10px] text-muted-foreground">Total Alerts</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500/10 to-rose-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-rose-600">
              {criticalAlerts}
            </div>
            <div className="text-[10px] text-muted-foreground">Critical</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {highAlerts}
            </div>
            <div className="text-[10px] text-muted-foreground">High</div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {resolvedToday}
            </div>
            <div className="text-[10px] text-muted-foreground">Resolved Today</div>
          </div>
        </div>

        {/* Open Alerts Banner */}
        {openAlerts.length > 0 && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-rose-700">
                  {openAlerts.length} Open Alert{openAlerts.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-rose-600">
                  Immediate attention required
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Alerts</span>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => {
              const severityInfo = severityConfig[alert.severity]
              const statusInfo = statusConfig[alert.status]
              const timeAgo = Math.floor((new Date().getTime() - new Date(alert.timestamp).getTime()) / 60000)

              return (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${severityInfo.color}`}>
                          {severityInfo.label}
                        </Badge>
                        <Badge className={`text-xs ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.source}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No security alerts</p>
            <p className="text-xs mt-1">System is secure</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
