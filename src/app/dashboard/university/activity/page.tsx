'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Activity,
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Filter,
  Search,
  MoreVertical,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { VerificationGate } from '@/components/verification-gate'
import { authFetch } from '@/lib/api-response'

interface ActivityItem {
  id: string
  type: 'user' | 'project' | 'verification' | 'grant' | 'course'
  title: string
  description: string
  user?: {
    name: string
    avatar?: string
    role?: string
  }
  timestamp: Date
  metadata?: any
}

export default function UniversityActivityPage() {
  const { user } = useAuth()
  useRoleAccess(['UNIVERSITY', 'PLATFORM_ADMIN'])

  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [timeRange, setTimeRange] = useState('7d')

  const fetchActivities = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await authFetch(`/api/dashboard/university/activity?universityId=${user.university?.id}&timeRange=${timeRange}`)
      const data = await response.json()

      if (data.success) {
        setActivities(data.data?.activities || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch activities',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch activities error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivities()
    }
  }, [user, timeRange])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Users className="h-4 w-4" />
        </div>
      case 'project':
        return <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
          <Briefcase className="h-4 w-4" />
        </div>
      case 'verification':
        return <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      case 'grant':
        return <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
          <DollarSign className="h-4 w-4" />
        </div>
      case 'course':
        return <div className="p-2 bg-teal-100 text-teal-600 rounded-full">
          <GraduationCap className="h-4 w-4" />
        </div>
      default:
        return <div className="p-2 bg-slate-100 text-slate-600 rounded-full">
          <Activity className="h-4 w-4" />
        </div>
    }
  }

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'user': return 'border-l-4 border-l-blue-500'
      case 'project': return 'border-l-4 border-l-emerald-500'
      case 'verification': return 'border-l-4 border-l-purple-500'
      case 'grant': return 'border-l-4 border-l-amber-500'
      case 'course': return 'border-l-4 border-l-teal-500'
      default: return 'border-l-4 border-l-slate-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-700'
      case 'project': return 'bg-emerald-100 text-emerald-700'
      case 'verification': return 'bg-purple-100 text-purple-700'
      case 'grant': return 'bg-amber-100 text-amber-700'
      case 'course': return 'bg-teal-100 text-teal-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredActivities = (activities || []).filter((activity: ActivityItem) =>
    (filterType === 'ALL' || activity.type === filterType) &&
    (activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     activity.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const groupedActivities = filteredActivities.reduce((groups: any, activity: ActivityItem) => {
    const dateKey = activity.timestamp.toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(activity)
    return groups
  }, {})

  return (
    <VerificationGate user={user} restrictActions={false} showBadge={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <header className="mb-6 sm:mb-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Activity Timeline
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {user?.university?.name || 'University'} • Track all university activities
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/university">
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Filters */}
          <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                >
                  <option value="ALL">All Types</option>
                  <option value="user">Users</option>
                  <option value="project">Projects</option>
                  <option value="verification">Verifications</option>
                  <option value="grant">Grants</option>
                  <option value="course">Courses</option>
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="365d">Last year</option>
                </select>
                <Button size="sm" onClick={fetchActivities}>
                  <Activity className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading activities...</p>
              </div>
            ) : Object.keys(groupedActivities).length === 0 ? (
              <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardContent className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm text-muted-foreground mb-4">No activities found</p>
                </CardContent>
              </Card>
            ) : (
              Object.keys(groupedActivities)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map((dateKey: string) => (
                  <div key={dateKey} className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-md">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {new Date(dateKey).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(dateKey).getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="border-t-2 border-slate-200 dark:border-slate-700"></div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                      <div className="ml-8 space-y-4">
                        {groupedActivities[dateKey].map((activity: ActivityItem) => (
                          <Card
                            key={activity.id}
                            className={`${getTimelineColor(activity.type)} border-l-4 border-t-0 border-r border-b bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow`}
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                  {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-base">{activity.title}</h4>
                                        <Badge className={getTypeColor(activity.type)}>
                                          {activity.type}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                      </p>
                                      {activity.user && (
                                        <div className="flex items-center gap-2 mt-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                              {activity.user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm">{activity.user.name}</span>
                                          <Badge variant="outline" className="text-xs">
                                            {activity.user.role}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatRelativeTime(activity.timestamp)}
                                      </span>
                                      <Button size="sm" variant="ghost">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </VerificationGate>
  )
}
