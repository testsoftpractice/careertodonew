'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { logoutAndRedirect } from '@/lib/utils/logout'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import {
  StatsCard,
  ActivityList,
  QuickActions,
  TaskCard,
  ProjectCard,
  WelcomeHeader,
} from '@/components/dashboard-widgets'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trophy,
  Star,
  Target,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Kanban,
  Zap,
  ArrowRight,
  Settings,
  Calendar as CalendarIcon,
  Bell,
  Play,
  Pause,
  Square,
  Timer,
  CalendarDays,
  LogOut,
  Edit3,
  Save,
  X,
  User,
  ClipboardList,
  MoreVertical,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function StudentDashboard() {
  const { user } = useAuth()

  useRoleAccess(['STUDENT', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState('overview')
  const [isEditMode, setIsEditMode] = useState(false)

  // Time Tracking State
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<string | null>(null)
  const [timeEntries, setTimeEntries] = useState<any[]>([])

  // Leave Management State
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  // Task Creation State
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: 'none',
  })
  const [availableProjects, setAvailableProjects] = useState<any[]>([])

  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    tasksInProgress: 0,
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

  const [loading, setLoading] = useState({
    stats: false,
    projects: false,
    tasks: false,
  })

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerRunning])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
      fetchTasks()
      fetchTimeEntries()
      fetchLeaveRequests()
      fetchAvailableProjects()
    } else if (activeTab === 'projects') {
      fetchProjects()
    } else if (activeTab === 'tasks' || activeTab === 'kanban') {
      fetchTasks()
      fetchAvailableProjects()
    } else if (activeTab === 'time-tracking') {
      fetchTimeEntries()
      fetchTasks()
    } else if (activeTab === 'leave-management') {
      fetchLeaveRequests()
    }
  }, [activeTab, user])

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
      const response = await fetch(`/api/projects?ownerId=${user.id}`)
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

  const fetchAvailableProjects = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/projects?ownerId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setAvailableProjects(data.data || [])
      }
    } catch (error) {
      console.error('Fetch projects error:', error)
    }
  }

  const fetchTimeEntries = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/time-entries?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setTimeEntries(data.data || [])
      }
    } catch (error) {
      console.error('Fetch time entries error:', error)
    }
  }

  const fetchLeaveRequests = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/leave-requests?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setLeaveRequests(data.data || [])
      }
    } catch (error) {
      console.error('Fetch leave requests error:', error)
    }
  }

  const handleLogout = async () => {
    const success = await logoutAndRedirect()

    if (success) {
      toast({ title: 'Success', description: 'Logged out successfully' })
    } else {
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
    }
  }

  const quickActions = [
    { id: 'create-project', label: 'New Project', icon: Plus, href: '/projects/create' },
    { id: 'create-task', label: 'New Task', icon: Plus, onClick: () => setShowTaskDialog(true) },
    { id: 'find-projects', label: 'Find Projects', icon: Search, href: '/projects' },
    { id: 'browse-jobs', label: 'Browse Jobs', icon: Briefcase, href: '/jobs' },
  ]

  // Timer functions
  const startTimer = () => {
    if (!selectedTaskForTimer) {
      toast({
        title: 'Task Required',
        description: 'Please select a task to track time for.',
        variant: 'destructive',
      })
      return
    }
    setTimerRunning(true)
  }

  const pauseTimer = () => {
    setTimerRunning(false)
  }

  const stopTimer = async () => {
    if (!selectedTaskForTimer || timerSeconds === 0) return

    try {
      const hours = (timerSeconds / 3600).toFixed(2)

      await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          taskId: selectedTaskForTimer,
          hours,
          description: 'Time tracking from dashboard timer',
        }),
      })

      toast({ title: 'Success', description: 'Time entry saved successfully' })

      setTimerSeconds(0)
      setTimerRunning(false)
      setSelectedTaskForTimer(null)
      fetchTimeEntries()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save time entry', variant: 'destructive' })
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Leave request functions
  const handleCreateLeaveRequest = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...leaveForm,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Leave request submitted successfully' })
        setShowLeaveDialog(false)
        setLeaveForm({ leaveType: '', startDate: '', endDate: '', reason: '' })
        fetchLeaveRequests()
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to submit leave request', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit leave request', variant: 'destructive' })
    }
  }

  // Task creation functions
  const handleCreateTask = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate,
          assigneeId: user.id,
          projectId: taskForm.projectId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task created successfully' })
        setShowTaskDialog(false)
        setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', projectId: '' })
        fetchTasks()
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to create task', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create task', variant: 'destructive' })
    }
  }

  const handleDeleteLeaveRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave request?')) return

    try {
      const response = await fetch(`/api/leave-requests/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Leave request deleted successfully' })
        fetchLeaveRequests()
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to delete leave request', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete leave request', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {/* Welcome Header */}
        <Card className="mb-6 sm:mb-8 border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-muted-foreground mt-1">Here's your overview for today</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="cursor-pointer"
                  title="Edit Dashboard"
                >
                  {isEditMode ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="cursor-pointer"
                  title="Settings"
                >
                  <Link href="/dashboard/student/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4 sm:space-y-6">
          <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="p-2">
              <TabsList className="bg-transparent h-auto w-full overflow-x-auto flex-wrap p-1 gap-2">
                <TabsTrigger
                  value="overview"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Tasks</span>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger
                  value="time-tracking"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <Timer className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Time Tracking</span>
                </TabsTrigger>
                <TabsTrigger
                  value="leave-management"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Leave Management</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Cards Grid */}
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Overview Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard
                    title="Active Projects"
                    value={loading.stats ? 0 : stats.activeProjects}
                    icon={Briefcase}
                    iconBgColor="bg-blue-500/10"
                    iconColor="text-blue-500"
                  />
                  <StatsCard
                    title="Tasks Completed"
                    value={loading.stats ? 0 : stats.tasksCompleted}
                    icon={CheckCircle2}
                    iconBgColor="bg-emerald-500/10"
                    iconColor="text-emerald-500"
                    trend={{ value: 15, label: 'this month', positive: true }}
                  />
                  <StatsCard
                    title="Tasks Pending"
                    value={loading.stats ? 0 : stats.tasksPending}
                    icon={Clock}
                    iconBgColor="bg-amber-500/10"
                    iconColor="text-amber-500"
                  />
                  <StatsCard
                    title="Overall Rating"
                    value={loading.stats ? 0 : stats.overallRating}
                    icon={Star}
                    iconBgColor="bg-purple-500/10"
                    iconColor="text-purple-500"
                  />
                </div>
                <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                  <StatsCard
                    title="In Progress Tasks"
                    value={loading.stats ? 0 : stats.tasksInProgress}
                    icon={TrendingUp}
                    iconBgColor="bg-orange-500/10"
                    iconColor="text-orange-500"
                    className="lg:col-span-2"
                  />
                  <StatsCard
                    title="Recent Activity"
                    value={loading.stats ? 0 : stats.recentActivityCount}
                    icon={Target}
                    iconBgColor="bg-pink-500/10"
                    iconColor="text-pink-500"
                    trend={{ value: 25, label: 'this week', positive: true }}
                  />
                  <StatsCard
                    title="Completed Projects"
                    value={loading.stats ? 0 : stats.completedProjects}
                    icon={Trophy}
                    iconBgColor="bg-amber-500/10"
                    iconColor="text-amber-500"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Tasks */}
              <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Recent Tasks
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="cursor-pointer">
                      <Link href="/dashboard/student?tab=tasks" className="flex items-center gap-1 text-sm">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {tasks.slice(0, 4).map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        status={task.status}
                        dueDate={task.dueDate ? new Date(task.dueDate) : undefined}
                        assignee={task.assignee}
                        progress={task.progress || 0}
                        projectName={task.project?.name}
                      />
                    ))}
                    {loading.tasks && (
                      <div className="sm:col-span-2 flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-pink-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityList
                    title=""
                    items={[]}
                    maxItems={5}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions
                  title=""
                  actions={quickActions}
                  layout="grid"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-primary" />
                    All Tasks
                  </CardTitle>
                  <Button
                    onClick={() => setShowTaskDialog(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      status={task.status}
                      dueDate={task.dueDate ? new Date(task.dueDate) : undefined}
                      assignee={task.assignee}
                      progress={task.progress || 0}
                      projectName={task.project?.name}
                    />
                  ))}
                  {loading.tasks && tasks.length === 0 && (
                    <div className="sm:col-span-2 flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                    </div>
                  )}
                  {!loading.tasks && tasks.length === 0 && (
                    <div className="sm:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                      <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No tasks yet</p>
                      <Button
                        onClick={() => setShowTaskDialog(true)}
                        className="mt-4 cursor-pointer"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  All Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      description={project.description}
                      status={project.status}
                      startDate={project.startDate ? new Date(project.startDate) : undefined}
                      endDate={project.endDate ? new Date(project.endDate) : undefined}
                      budget={project.budget}
                      membersCount={project.members?.length || 0}
                      tasksCount={project.tasks?.length || 0}
                      progress={project.progress || 0}
                      category={project.category}
                      owner={project.owner}
                    />
                  ))}
                  {loading.projects && projects.length === 0 && (
                    <div className="sm:col-span-2 flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                    </div>
                  )}
                  {!loading.projects && projects.length === 0 && (
                    <div className="sm:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No projects yet</p>
                      <Button
                        asChild
                        className="mt-4 cursor-pointer"
                      >
                        <Link href="/projects/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Project
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Tracking Tab */}
          <TabsContent value="time-tracking" className="space-y-4 sm:space-y-6">
            {/* Timer Card */}
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-orange-500" />
                  Time Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-mono font-bold mb-4">
                    {formatTime(timerSeconds)}
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {!timerRunning ? (
                      <Button
                        onClick={startTimer}
                        disabled={timerSeconds > 0 && !selectedTaskForTimer}
                        className="cursor-pointer"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseTimer}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={stopTimer}
                      disabled={!timerRunning && timerSeconds === 0}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop & Save
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label htmlFor="task-select" className="mb-2 block">Select Task</Label>
                  <Select
                    value={selectedTaskForTimer || ''}
                    onValueChange={setSelectedTaskForTimer}
                  >
                    <SelectTrigger id="task-select" className="cursor-pointer">
                      <SelectValue placeholder="Choose a task to track time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id} className="cursor-pointer">
                          {task.title} {task.project && `- ${task.project.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Time Entries */}
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {timeEntries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No time entries yet</p>
                      <p className="text-sm">Start tracking time on your tasks!</p>
                    </div>
                  ) : (
                    timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{entry.task?.title || 'Unknown task'}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.description || 'No description'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{entry.hours}h</p>
                          {entry.billable && (
                            <Badge variant="secondary" className="text-xs">Billable</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave-management" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-purple-500" />
                    Leave Requests
                  </CardTitle>
                  <Button
                    onClick={() => setShowLeaveDialog(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No leave requests yet</p>
                      <p className="text-sm">Submit your first leave request!</p>
                    </div>
                  ) : (
                    leaveRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                request.status === 'APPROVED'
                                  ? 'default'
                                  : request.status === 'REJECTED'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className="cursor-pointer"
                            >
                              {request.status}
                            </Badge>
                            <span className="font-semibold">
                              {request.leaveType}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.startDate).toLocaleDateString()} -{' '}
                            {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {request.reason}
                          </p>
                        </div>
                        {request.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLeaveRequest(request.id)}
                            className="cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-950 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Fill in the details below to create a new task.
            </div>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title" className="font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="task-title"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger id="task-priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="task-project">Project (Optional)</Label>
              <Select value={taskForm.projectId} onValueChange={(value) => setTaskForm({ ...taskForm, projectId: value })}>
                <SelectTrigger id="task-project" className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.length === 0 ? (
                    <SelectItem value="none" disabled>No projects available</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="none">No project</SelectItem>
                      {availableProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTaskDialog(false)
                setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', projectId: 'none' })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={loading || !taskForm.title}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Leave Request Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select
                value={leaveForm.leaveType}
                onValueChange={(value) => setLeaveForm({ ...leaveForm, leaveType: value })}
              >
                <SelectTrigger id="leave-type" className="cursor-pointer">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK_LEAVE" className="cursor-pointer">Sick Leave</SelectItem>
                  <SelectItem value="VACATION" className="cursor-pointer">Vacation</SelectItem>
                  <SelectItem value="PERSONAL" className="cursor-pointer">Personal</SelectItem>
                  <SelectItem value="EMERGENCY" className="cursor-pointer">Emergency</SelectItem>
                  <SelectItem value="OTHER" className="cursor-pointer">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="cursor-pointer"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="leave-reason">Reason</Label>
              <Textarea
                id="leave-reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Enter reason for leave"
                rows={3}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLeaveRequest}
              disabled={!leaveForm.leaveType || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason}
              className="cursor-pointer"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
