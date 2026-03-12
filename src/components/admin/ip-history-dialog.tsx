'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Globe,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface IPHistoryRecord {
  id: string
  ipAddress: string
  port: number | null
  userAgent: string | null
  action: string
  status: string
  failureReason: string | null
  country: string | null
  region: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  timezone: string | null
  isp: string | null
  deviceType: string | null
  os: string | null
  browser: string | null
  loginCount: number
  isProxy: boolean
  isVpn: boolean
  isTor: boolean
  isDatacenter: boolean
  threatLevel: string
  createdAt: string
}

interface UniqueIP {
  ipAddress: string
  country: string | null
  region: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  timezone: string | null
  isp: string | null
  loginCount: number
  lastSeen: string
}

interface IPStats {
  totalLogins: number
  uniqueIPs: number
  uniqueCountries: number
  uniqueCities: number
  mostRecentLogin: {
    ipAddress: string
    city: string | null
    country: string | null
    createdAt: string
  } | null
  mostUsedIP: {
    ipAddress: string
    city: string | null
    country: string | null
    loginCount: number
  } | null
}

interface IPHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

export function IPHistoryDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: IPHistoryDialogProps) {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<IPHistoryRecord[]>([])
  const [uniqueIPs, setUniqueIPs] = useState<UniqueIP[]>([])
  const [stats, setStats] = useState<IPStats | null>(null)
  const [activeTab, setActiveTab] = useState<'history' | 'unique' | 'stats'>('history')
  const [filterStatus, setFilterStatus] = useState<'all' | 'SUCCESS' | 'FAILED'>('all')

  const fetchIPData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [historyRes, uniqueRes, statsRes] = await Promise.all([
        fetch(`/api/admin/users/${userId}/ip-history?limit=100&status=${filterStatus === 'all' ? '' : filterStatus}`),
        fetch(`/api/admin/users/${userId}/ip-history?view=unique`),
        fetch(`/api/admin/users/${userId}/ip-stats`),
      ])

      const [historyData, uniqueData, statsData] = await Promise.all([
        historyRes.json(),
        uniqueRes.json(),
        statsRes.json(),
      ])

      if (historyData.success) {
        setHistory(historyData.data.records || [])
      }
      if (uniqueData.success) {
        setUniqueIPs(uniqueData.data || [])
      }
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Error fetching IP data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && userId) {
      fetchIPData()
    }
  }, [open, userId, filterStatus])

  const getThreatBadge = (level: string) => {
    const badges = {
      LOW: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
      MEDIUM: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertTriangle },
      HIGH: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
    }
    const config = badges[level as keyof typeof badges] || badges.LOW
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {level}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === 'SUCCESS') {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Success
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            IP Tracking History
          </DialogTitle>
          <DialogDescription>
            Viewing IP usage and login history for <span className="font-semibold">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">
              Login History
            </TabsTrigger>
            <TabsTrigger value="unique">
              Unique IPs ({uniqueIPs.length})
            </TabsTrigger>
            <TabsTrigger value="stats">
              Statistics
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mt-4 mb-2">
            <div className="flex items-center gap-2">
              {filterStatus !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIPData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {activeTab === 'history' && (
            <TabsContent value="history" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No login history found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(record.status)}
                            <div className="text-sm font-mono font-semibold">
                              {record.ipAddress}
                              {record.port && `:${record.port}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span>
                              {record.city && record.country
                                ? `${record.city}, ${record.country}`
                                : record.country || 'Unknown location'}
                            </span>
                          </div>
                          {record.isp && (
                            <div className="text-muted-foreground truncate">
                              ISP: {record.isp}
                            </div>
                          )}
                          {record.deviceType && (
                            <div className="text-muted-foreground">
                              {record.deviceType}
                            </div>
                          )}
                          {record.os && (
                            <div className="text-muted-foreground truncate">
                              {record.os}
                            </div>
                          )}
                        </div>

                        {record.failureReason && (
                          <div className="mt-2 text-xs text-red-500">
                            Failed: {record.failureReason}
                          </div>
                        )}

                        {(record.isProxy || record.isVpn || record.isTor || record.isDatacenter) && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {record.isProxy && <Badge variant="outline" className="text-xs">Proxy</Badge>}
                            {record.isVpn && <Badge variant="outline" className="text-xs">VPN</Badge>}
                            {record.isTor && <Badge variant="outline" className="text-xs">Tor</Badge>}
                            {record.isDatacenter && <Badge variant="outline" className="text-xs">Datacenter</Badge>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          )}

          {activeTab === 'unique' && (
            <TabsContent value="unique" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : uniqueIPs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No IP records found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uniqueIPs.map((ip, index) => (
                      <div
                        key={ip.ipAddress}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-sm font-mono font-semibold">
                                {ip.ipAddress}
                              </div>
                              {index === 0 && (
                                <Badge variant="default" className="text-xs">
                                  Most Recent
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span>
                                  {ip.city && ip.country
                                    ? `${ip.city}, ${ip.country}`
                                    : ip.country || 'Unknown location'}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                Logins: {ip.loginCount}
                              </div>
                              {ip.isp && (
                                <div className="text-muted-foreground truncate col-span-2">
                                  ISP: {ip.isp}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            <div>Last seen:</div>
                            <div>{formatDistanceToNow(new Date(ip.lastSeen), { addSuffix: true })}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          )}

          {activeTab === 'stats' && (
            <TabsContent value="stats" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : !stats ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No statistics available
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{stats.totalLogins}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Logins</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.uniqueIPs}</div>
                        <div className="text-xs text-muted-foreground mt-1">Unique IPs</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.uniqueCountries}</div>
                        <div className="text-xs text-muted-foreground mt-1">Countries</div>
                      </div>
                      <div className="p-4 bg-emerald-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600">{stats.uniqueCities}</div>
                        <div className="text-xs text-muted-foreground mt-1">Cities</div>
                      </div>
                    </div>

                    {/* Most Recent Login */}
                    {stats.mostRecentLogin && (
                      <div className="p-4 rounded-lg border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Most Recent Login
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">{stats.mostRecentLogin.ipAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>
                              {stats.mostRecentLogin.city && stats.mostRecentLogin.country
                                ? `${stats.mostRecentLogin.city}, ${stats.mostRecentLogin.country}`
                                : stats.mostRecentLogin.country || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span>{formatDistanceToNow(new Date(stats.mostRecentLogin.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Most Used IP */}
                    {stats.mostUsedIP && (
                      <div className="p-4 rounded-lg border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Most Used IP
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">{stats.mostUsedIP.ipAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>
                              {stats.mostUsedIP.city && stats.mostUsedIP.country
                                ? `${stats.mostUsedIP.city}, ${stats.mostUsedIP.country}`
                                : stats.mostUsedIP.country || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Login Count:</span>
                            <span className="font-semibold">{stats.mostUsedIP.loginCount} times</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
