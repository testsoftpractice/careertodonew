import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Server, Database, Wifi, Cpu, HardDrive, AlertTriangle, CheckCircle2 } from 'lucide-react'

export interface SystemResource {
  name: string
  usage: number
  capacity: number
  status: 'healthy' | 'warning' | 'critical'
  type: 'cpu' | 'memory' | 'storage' | 'network'
}

interface SystemHealthProps {
  resources: SystemResource[]
  uptime: number
  responseTime: number
  activeConnections: number
  systemStatus: 'operational' | 'degraded' | 'down'
  className?: string
}

export function SystemHealth({
  resources,
  uptime,
  responseTime,
  activeConnections,
  systemStatus,
  className = '',
}: SystemHealthProps) {
  const iconMap = {
    cpu: Cpu,
    memory: Database,
    storage: HardDrive,
    network: Wifi,
  }

  const statusConfig = {
    operational: { label: 'Operational', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    degraded: { label: 'Degraded', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
    down: { label: 'Down', color: 'bg-rose-100 text-rose-700', icon: AlertTriangle },
  }

  const statusInfo = statusConfig[systemStatus]
  const StatusIcon = statusInfo.icon

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* System Status */}
        <div className={`p-3 rounded-lg ${systemStatus === 'operational' ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200' : systemStatus === 'degraded' ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200' : 'bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${systemStatus === 'operational' ? 'text-emerald-600' : systemStatus === 'degraded' ? 'text-amber-600' : 'text-rose-600'}`} />
              <div>
                <div className="text-sm font-semibold">System Status</div>
                <div className="text-xs text-muted-foreground">Overall platform health</div>
              </div>
            </div>
            <Badge className={`${statusInfo.color}`}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {uptime.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Uptime</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {responseTime}ms
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Response</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {activeConnections}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Connections</div>
          </div>
        </div>

        {/* Resource Usage */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Resource Usage</span>
          </div>
          <div className="space-y-3">
            {resources.map((resource) => {
              const Icon = iconMap[resource.type]
              const usagePercentage = (resource.usage / resource.capacity) * 100
              const getStatusColor = (percentage: number) => {
                if (percentage >= 90) return 'bg-rose-500'
                if (percentage >= 75) return 'bg-amber-500'
                return 'bg-emerald-500'
              }

              return (
                <div key={resource.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{resource.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${resource.status === 'healthy' ? 'text-emerald-600 border-emerald-300' : resource.status === 'warning' ? 'text-amber-600 border-amber-300' : 'text-rose-600 border-rose-300'}`}
                      >
                        {resource.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold">{usagePercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
