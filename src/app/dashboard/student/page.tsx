'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Award,
  Briefcase,
  Calendar,
  Star,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Shield,
  Eye,
  Share,
  Bell,
  User,
  Settings,
  FileText,
  Timer,
  Trophy,
  LogOut,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Kanban,
  Calendar as CalendarIcon,
  FolderOpen,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import WorkSessionTimer from '@/components/time-tracking/work-session-timer'
import TimeEntriesList from '@/components/time-tracking/time-entries-list'
import PointsDashboard from '@/components/points/points-dashboard'
import PointsHistory from '@/components/points/points-history'
import KanbanTaskBoard from '@/components/task/KanbanTaskBoard'
import LeaveManagement from '@/components/leave/leave-management'
import { Send } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()

  useRoleAccess(['STUDENT', 'PLATFORM_ADMIN'])
  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    overallProgress: 0,
    overallRating: 0,
    breakdown: {
      execution: 0,
      collaboration: 0,
      leadership: 0,
      ethics: 0,
      reliability: 0,
    },
    recentActivityCount: 0,
  })

  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [verifications, setVerifications] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    projects: false,
    tasks: false,
    records: false,
    verifications: false,
  })

  const formatScore = (value: number | undefined): string => {
    return (value || 0).toFixed(1)
  }

  // Project management helper functions
  const canCreateProject = (projects: any[]) => {
    // Can create if no projects exist
    if (projects.length === 0) return true

    // Check the latest project status
    const latestProject = projects[0]
    if (!latestProject) return true

    // Can create if the latest project is rejected
    return latestProject.status === 'REJECTED'
  }

  const getActiveProjectStatus = (projects: any[]) => {
    const latestProject = projects[0]
    if (!latestProject) return ''

    return formatProjectStatus(latestProject.status)
  }

  const formatProjectStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'UNDER_REVIEW': 'Under Review',
      'REJECTED': 'Rejected',
      'VERIFIED': 'Verified',
      'ACTIVE': 'Active',
      'COMPLETED': 'Completed',
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'ACTIVE':
        return 'default'
      case 'REJECTED':
        return 'destructive'
      case 'UNDER_REVIEW':
      case 'COMPLETED':
      default:
        return 'secondary'
    }
  }

  const fetchStats = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await fetch(`/api/dashboard/student/stats?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const fetchProjects = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, projects: true }))
      const response = await fetch(`/api/projects?projectLeadId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error('Fetch projects error:', error)
    } finally {
      setLoading(prev => ({ ...prev, projects: false }))
    }
  }

  const fetchTasks = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, tasks: true }))
      const response = await fetch(`/api/tasks?assigneeId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setTasks(data.data || [])
      }
    } catch (error) {
      console.error('Fetch tasks error:', error)
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchRecords = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, records: true }))
      const response = await fetch(`/api/records?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setRecords(data.data || [])
      }
    } catch (error) {
      console.error('Fetch records error:', error)
    } finally {
      setLoading(prev => ({ ...prev, records: false }))
    }
  }

  const fetchVerifications = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, verifications: true }))
      const response = await fetch(`/api/verifications?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setVerifications(data.data || [])
      }
    } catch (error) {
      console.error('Fetch verifications error:', error)
    } finally {
      setLoading(prev => ({ ...prev, verifications: false }))
    }
  }

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
      fetchTasks()
    } else if (activeTab === 'projects') {
      fetchProjects()
    } else if (activeTab === 'tasks' || activeTab === 'kanban') {
      fetchTasks()
    } else if (activeTab === 'leave') {
      // Leave management handles its own data fetching
    }
  }, [activeTab, user])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast({ title: 'Success', description: 'Logged out successfully' })
      window.location.href = '/auth'
    } catch (error) {
      console.error('Logout error:', error)
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-lg">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {user?.university?.name || 'University'} • {user?.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <WorkSessionTimer userId={user?.id} />
                <LeaveManagement userId={user?.id} compact={true} />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/student/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-violet-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Kanban className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Active Projects</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.activeProjects}</p>
                    </div>
                    <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Tasks Completed</p>
                      <p className="text-3xl sm:text-4xl font-bold">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-amber-100 text-xs sm:text-sm font-medium mb-1">Total Points</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.recentActivityCount * 10}</p>
                    </div>
                    <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-amber-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">Overall Rating</p>
                      <p className="text-3xl sm:text-4xl font-bold">{formatScore(stats.overallRating)}</p>
                    </div>
                    <Star className="h-8 w-8 sm:h-10 sm:w-10 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                      Recent Tasks
                    </CardTitle>
                    <Link href="/dashboard/student?tab=tasks">
                      <Button variant="ghost" size="sm" className="text-primary">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.tasks ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading tasks...</p>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">No tasks yet</p>
                      <Link href="/projects/create">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {tasks.slice(0, 5).map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-700"
                        >
                          <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-500'
                              : task.priority === 'URGENT'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{task.project?.title || 'Unknown Project'}</p>
                          </div>
                          <Badge variant={task.status === 'COMPLETED' ? 'default' : 'outline'} className="text-xs">
                            {task.status?.replace('_', ' ') || 'Open'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    Performance
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Your skill breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading.stats ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 border-4 border-t-white border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs sm:text-sm text-slate-300 mt-2">Loading...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm text-slate-300">Execution</span>
                          <span className="font-semibold text-xs sm:text-sm">{formatScore(stats.breakdown?.execution)}/5</span>
                        </div>
                        <Progress value={stats.breakdown?.execution || 0} max={5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm text-slate-300">Collaboration</span>
                          <span className="font-semibold text-xs sm:text-sm">{formatScore(stats.breakdown?.collaboration)}/5</span>
                        </div>
                        <Progress value={stats.breakdown?.collaboration || 0} max={5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm text-slate-300">Leadership</span>
                          <span className="font-semibold text-xs sm:text-sm">{formatScore(stats.breakdown?.leadership)}/5</span>
                        </div>
                        <Progress value={stats.breakdown?.leadership || 0} max={5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm text-slate-300">Ethics</span>
                          <span className="font-semibold text-xs sm:text-sm">{formatScore(stats.breakdown?.ethics)}/5</span>
                        </div>
                        <Progress value={stats.breakdown?.ethics || 0} max={5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm text-slate-300">Reliability</span>
                          <span className="font-semibold text-xs sm:text-sm">{formatScore(stats.breakdown?.reliability)}/5</span>
                        </div>
                        <Progress value={stats.breakdown?.reliability || 0} max={5} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/projects/create" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">Create Project</h3>
                        <p className="text-xs text-muted-foreground">Start something new</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/jobs" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">Find Jobs</h3>
                        <p className="text-xs text-muted-foreground">Explore opportunities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/marketplace" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">Marketplace</h3>
                        <p className="text-xs text-muted-foreground">Connect & collaborate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <PointsDashboard userId={user?.id} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      All Tasks
                    </CardTitle>
                    <CardDescription>
                      Manage your assigned and created tasks
                    </CardDescription>
                  </div>
                  <Link href="/projects/create">
                    <Button className="shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading.tasks ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      You don't have any tasks assigned. Create or join a project to get started!
                    </p>
                    <Link href="/projects/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-500'
                              : task.priority === 'URGENT'
                              ? 'bg-red-500'
                              : task.priority === 'HIGH'
                              ? 'bg-orange-500'
                              : 'bg-amber-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm sm:text-base mb-1">{task.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{task.description || 'No description'}</p>
                              </div>
                              <Badge
                                variant={
                                  task.status === 'COMPLETED'
                                    ? 'default'
                                    : task.status === 'IN_PROGRESS'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className="text-xs shrink-0"
                              >
                                {task.status?.replace('_', ' ') || 'Open'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.priority && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    task.priority === 'URGENT'
                                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                      : task.priority === 'HIGH'
                                      ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                      : task.priority === 'MEDIUM'
                                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                      : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  }`}
                                >
                                  {task.priority}
                                </Badge>
                              )}
                              {task.dueDate && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Badge>
                              )}
                              {task.project?.title && (
                                <Badge variant="outline" className="text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {task.project.title}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <TimeEntriesList userId={user?.id} />
          </TabsContent>

          <TabsContent value="kanban" className="space-y-4 sm:space-y-6">
            <KanbanTaskBoard
              tasks={tasks}
              onTaskMove={async (taskId: string, newStatus: string) => {
                try {
                  const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                  })
                  const data = await response.json()
                  if (data.success) {
                    toast({ title: 'Success', description: 'Task moved successfully' })
                    fetchTasks()
                  } else {
                    toast({ title: 'Error', description: data.error || 'Failed to move task', variant: 'destructive' })
                  }
                } catch (error) {
                  console.error('Move task error:', error)
                  toast({ title: 'Error', description: 'Failed to move task', variant: 'destructive' })
                }
              }}
              onTaskUpdate={async (updatedTask) => {
                try {
                  const response = await fetch(`/api/tasks/${updatedTask.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTask),
                  })
                  const data = await response.json()
                  if (data.success) {
                    toast({ title: 'Success', description: 'Task updated successfully' })
                    fetchTasks()
                  } else {
                    toast({ title: 'Error', description: data.error || 'Failed to update task', variant: 'destructive' })
                  }
                } catch (error) {
                  console.error('Update task error:', error)
                  toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' })
                }
              }}
              onTaskDelete={async (taskId: string) => {
                try {
                  const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                  })
                  const data = await response.json()
                  if (data.success) {
                    toast({ title: 'Success', description: 'Task deleted successfully' })
                    fetchTasks()
                  } else {
                    toast({ title: 'Error', description: data.error || 'Failed to delete task', variant: 'destructive' })
                  }
                } catch (error) {
                  console.error('Delete task error:', error)
                  toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' })
                }
              }}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                      Your Projects
                    </CardTitle>
                    <CardDescription>
                      Manage and track your project portfolio
                    </CardDescription>
                  </div>
                  <Link href="/projects/create">
                    <Button className="shadow-lg" disabled={!canCreateProject(projects)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {projects.length === 0 ? 'Create Project' : 'Create New Project'}
                    </Button>
                  </Link>
                </div>
                {projects.length > 0 && !canCreateProject(projects) && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You cannot create a new project while you have a {getActiveProjectStatus(projects)} project.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {loading.projects ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Start building your project portfolio by creating your first project!
                    </p>
                    <Link href="/projects/create">
                      <Button className="shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: any) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="group"
                      >
                        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge
                                variant={getStatusVariant(project.status)}
                                className="text-xs"
                              >
                                {formatProjectStatus(project.status)}
                              </Badge>
                              <Progress value={project.completionRate || 0} className="w-20 h-2" />
                            </div>
                            <CardTitle className="text-base font-semibold line-clamp-2">
                              {project.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{project.teamSize || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3.5 w-3.5" />
                                <span>{project.completionRate || 0}%</span>
                              </div>
                            </div>
                            {project.status === 'REJECTED' && project.rejectionReason && (
                              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-xs text-red-600 dark:text-red-400">
                                  <span className="font-semibold">Rejection Reason:</span> {project.rejectionReason}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
