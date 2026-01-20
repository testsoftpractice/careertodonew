import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  loading?: boolean
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  trend,
  loading = false,
  className = '',
}: StatsCardProps) {
  return (
    <Card className={`${className} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {loading ? (
                <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 animate-pulse rounded" />
              ) : (
                value
              )}
            </p>
            {trend && (
              <p className={`text-xs sm:text-sm mt-2 flex items-center gap-1 ${
                trend.positive !== false ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                <span className="font-semibold">
                  {trend.positive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">
                  {trend.label}
                </span>
              </p>
            )}
          </div>
          <div className={`${iconBgColor} ${iconColor} p-2.5 sm:p-3 rounded-xl shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
