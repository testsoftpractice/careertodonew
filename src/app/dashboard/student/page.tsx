'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { authFetch } from '@/lib/api-response'
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
  Building,
  Zap,
  ArrowRight,
  Settings,
  Calendar as CalendarIcon,
  Bell,
  Play,
  Pause,
  Square,
  Timer,  MapPin,
  CalendarDays,
  LogOut,
  Edit3,
  Save,
  X,
  User,
  ClipboardList,
  MoreVertical,
  ChevronRight,
  Trash2,
  Building2,
} from 'lucide-react'
import ProfessionalKanbanBoard, { Task as KanbanTask } from '@/components/task/ProfessionalKanbanBoard'
import WorkSessionTimer from '@/components/time-tracking/work-session-timer'
import TaskFormDialog from '@/components/task/TaskFormDialog'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { LeaderboardPreview } from '@/components/student/leaderboard-preview'
import { NeedsPreview } from '@/components/student/needs-preview'
import { PracticeGround } from '@/components/student/practice-ground'
import { VerificationGate } from '@/components/verification-gate'

function DashboardContent({ user }: { user: any }) {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  useRoleAccess(['STUDENT', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview')
  const [isEditMode, setIsEditMode] = useState(false)

  // Time Tracking State
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<string | null>(null)
  const [currentWorkSessionId, setCurrentWorkSessionId] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState<'ONSITE' | 'REMOTE' | 'HYBRID'>('ONSITE')
  const [sessionLocation, setSessionLocation] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [timeSummary, setTimeSummary] = useState<any | null>(null)

  // Leave Management State
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  // View type for Tasks tab: personal vs project
  const [viewType, setViewType] = useState<'personal' | 'project'>('personal')
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [availableProjects, setAvailableProjects] = useState<any[]>([])
  const [selectedProjectForTimeTracking, setSelectedProjectForTimeTracking] = useState<string>('')

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

  // Personal tasks for Tasks tab
  const [personalTasks, setPersonalTasks] = useState<any[]>([])
  const [projectTasks, setProjectTasks] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    projects: false,
    tasks: false,
    createTask: false,
    updateTask: false,
  })



  // Kanban columns
  const columns = [
    { id: 'todo', title: 'To Do', status: 'TODO' },
    { id: 'in-progress', title: 'In Progress', status: 'IN_PROGRESS' },
    { id: 'review', title: 'Review', status: 'REVIEW' },
    { id: 'done', title: 'Done', status: 'DONE' },
  ]

  const getColumnTasks = (columnId: string) => {
    // Get tasks based on current view type
    const currentTasks = viewType === 'personal' ? personalTasks : projectTasks
    return currentTasks.filter(t => t.status === columns.find(c => c.id === columnId)?.status)
  }

  // Task dialog state
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    dueDate: '',
    projectId: 'none',
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
      if (interval) { clearInterval(interval); }
    }
  }, [timerRunning])

  // Auto-save timer every 30 seconds
  useEffect(() => {
    if (!timerRunning || !currentWorkSessionId) return

    const saveInterval = setInterval(async () => {
      if (selectedTaskForTimer && timerSeconds > 0) {
        await saveTimeEntry(false) // Save without stopping
      }
    }, 30000) // Save every 30 seconds

    return () => clearInterval(saveInterval)
  }, [timerRunning, currentWorkSessionId, selectedTaskForTimer, timerSeconds])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
      fetchTasks()
      fetchTimeEntries()
      fetchLeaveRequests()
      fetchAvailableProjects()
    } else if (activeTab === 'projects') {
      fetchProjects()
    } else if (activeTab === 'tasks') {
      fetchTasks()
      fetchAvailableProjects()
    } else if (activeTab === 'time-tracking') {
      fetchTimeEntries()
      fetchTimeSummary()
      fetchTasks()
    } else if (activeTab === 'leave-management') {
      fetchLeaveRequests()
    }
  }, [activeTab, user, viewType])

  // Fetch project tasks when project is selected (for Tasks tab)
  useEffect(() => {
    if (viewType === 'project' && selectedProject && activeTab === 'tasks') {
      fetchProjectTasks(selectedProject.id)
    }
  }, [viewType, selectedProject, activeTab, user])

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await authFetch(`/api/dashboard/student/stats?userId=${user.id}`)
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
      const response = await authFetch(`/api/projects?ownerId=${user.id}`)
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

      // Fetch both personal tasks and assigned project tasks
      const [personalResponse, projectResponse] = await Promise.all([
        authFetch(`/api/tasks/personal?userId=${user.id}`),
        authFetch(`/api/tasks?assigneeId=${user.id}`),
      ])

      const personalData = await personalResponse.json()
      const projectData = await projectResponse.json()

      // GET personal tasks returns { success: true, data: tasks[] }
      setPersonalTasks(personalData.data || [])
      setProjectTasks(projectData.data || [])
      // Set combined tasks for backward compatibility
      setTasks([...(personalData.data || []), ...(projectData.data || [])])
    } catch (error) {
      console.error('Fetch tasks error:', error)
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchPersonalTasks = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, tasks: true }))
      const response = await authFetch(`/api/tasks/personal?userId=${user.id}`)
      const data = await response.json()
      // GET personal tasks returns { success: true, data: tasks[] }
      setPersonalTasks(data.data || [])
      // Also update combined tasks
      setTasks([...(data.data || []), ...projectTasks])
    } catch (error) {
      console.error('Fetch personal tasks error:', error)
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchProjectTasks = async (projectId: string) => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, tasks: true }))
      const response = await authFetch(`/api/tasks?projectId=${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project tasks')
      const data = await response.json()
      setProjectTasks(data.data || [])
    } catch (error) {
      console.error('Fetch project tasks error:', error)
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchAvailableProjects = async () => {
    if (!user) return

    try {
      const response = await authFetch('/api/projects')
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
      const response = await authFetch(`/api/time-entries?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setTimeEntries(data.data || [])
      }
    } catch (error) {
      console.error('Fetch time entries error:', error)
    }
  }

  const fetchTimeSummary = async () => {
    if (!user) return

    try {
      const response = await authFetch(`/api/time-summary?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setTimeSummary(data.data)
      }
    } catch (error) {
      console.error('Fetch time summary error:', error)
    }
  }

  const fetchLeaveRequests = async () => {
    if (!user) return

    try {
      const response = await authFetch(`/api/leave-requests?userId=${user.id}`)
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
    { id: 'create-task', label: 'New Task', icon: Plus, onClick: () => { setActiveTab('tasks'); setTimeout(() => setShowTaskDialog(true), 100); } },
    { id: 'find-projects', label: 'Find Projects', icon: Search, href: '/projects' },
    { id: 'browse-jobs', label: 'Browse Jobs', icon: Briefcase, href: '/jobs' },
  ]

  // Timer functions
  const saveTimeEntry = async (stopTimerAfter = false) => {
    if (!user || !selectedTaskForTimer) return

    // Don't save if no time has been tracked
    if (timerSeconds === 0) {
      if (stopTimerAfter) {
        toast({ title: 'Info', description: 'No time to save' })
      }
      return
    }

    try {
      const hours = parseFloat((timerSeconds / 3600).toFixed(2))

      // Ensure hours is a positive number
      if (hours <= 0) {
        toast({ title: 'Info', description: 'No time to save' })
        return
      }

      const response = await authFetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          taskId: selectedTaskForTimer,
          hours,
          date: new Date().toISOString().split('T')[0],
          description: 'Time tracking from dashboard timer',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Save time entry failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to save time entry (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (!data.success) {
        const errorMsg = data.error || data.message || 'Failed to save time entry'
        console.error('Save time entry error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      if (stopTimerAfter) {
        toast({ title: 'Success', description: 'Time entry saved successfully' })
        fetchTimeEntries()
        setTimerSeconds(0)
        setCurrentWorkSessionId(null)
      }
    } catch (error) {
      console.error('Save time entry error:', error)
      toast({ title: 'Error', description: 'Failed to save time entry. Please try again.', variant: 'destructive' })
    }
  }

  const startTimer = async () => {
    if (!selectedTaskForTimer) {
      toast({
        title: 'Task Required',
        description: 'Please select a task to track time for.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Create work session
      // Filter out undefined/null values to prevent Prisma errors
      const sessionPayload: any = {
        userId: user?.id,
      }
      
      // Add projectId if task is associated with a project
      if (selectedTaskForTimer.projectId) {
        sessionPayload.projectId = selectedTaskForTimer.projectId
      } else if (selectedProjectForTimeTracking) {
        sessionPayload.projectId = selectedProjectForTimeTracking.id
      }
      
      // Always include type
      if (sessionType) {
        sessionPayload.type = sessionType
      }
      
      // Only add checkInLocation if it has a value
      if (sessionLocation) {
        sessionPayload.checkInLocation = sessionLocation
      }
      
      // Only add notes if it has a value
      if (sessionNotes) {
        sessionPayload.notes = sessionNotes
      }
      
      const response = await authFetch('/api/work-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Start timer failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to start timer (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()
      if (data.success) {
        setCurrentWorkSessionId(data.data.id)
        setTimerRunning(true)
        toast({ title: 'Success', description: 'Timer started successfully' })
      } else {
        const errorMsg = data.error || data.message || 'Failed to start timer'
        console.error('Start timer error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (error) {
      console.error('Start timer error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to start timer. Please try again.'
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
    }
  }

  const pauseTimer = async () => {
    if (!currentWorkSessionId) return

    // Save current time entry before pausing
    await saveTimeEntry(true)  // true = stop timer after saving
  }

  const toggleTimer = () => {
    if (timerRunning) {
      pauseTimer()
    } else {
      startTimer()
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

    // Validate form
    if (!leaveForm.leaveType) {
      toast({ title: 'Validation Error', description: 'Please select a leave type', variant: 'destructive' })
      return
    }

    if (!leaveForm.startDate) {
      toast({ title: 'Validation Error', description: 'Please select a start date', variant: 'destructive' })
      return
    }

    if (!leaveForm.endDate) {
      toast({ title: 'Validation Error', description: 'Please select an end date', variant: 'destructive' })
      return
    }

    if (!leaveForm.reason) {
      toast({ title: 'Validation Error', description: 'Please provide a reason for the leave', variant: 'destructive' })
      return
    }

    if (new Date(leaveForm.startDate) >= new Date(leaveForm.endDate)) {
      toast({ title: 'Validation Error', description: 'End date must be after start date', variant: 'destructive' })
      return
    }

    try {
      const response = await authFetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          leaveType: leaveForm.leaveType,
          startDate: leaveForm.startDate,
          endDate: leaveForm.endDate,
          reason: leaveForm.reason,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Leave request failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to submit leave request (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Leave request submitted successfully' })
        setShowLeaveDialog(false)
        setLeaveForm({ leaveType: '', startDate: '', endDate: '', reason: '' })
        fetchLeaveRequests()
      } else {
        const errorMsg = data.error || data.message || 'Failed to submit leave request'
        const errorDetails = data.details || data.validationErrors || ''
        console.error('Leave request error:', data)
        toast({ 
          title: 'Error', 
          description: errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg, 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit leave request. Please try again.'
      console.error('Leave request submit error:', error)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
    }
  }

  // Task creation and editing functions
  const handleCreateTask = async (taskData: any) => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, createTask: true }))

      // Validate required fields
      if (!taskData.title || taskData.title.trim().length === 0) {
        toast({ title: 'Validation Error', description: 'Task title is required', variant: 'destructive' })
        return
      }

      const payload: any = {
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : null,
        priority: taskData.priority || 'MEDIUM',
      }

      if (taskData.projectId && taskData.projectId !== 'none' && taskData.projectId !== '') {
        payload.projectId = taskData.projectId
        payload.assignedTo = user.id
        payload.assignedBy = user.id
        if (taskData.dueDate) {
          payload.dueDate = new Date(taskData.dueDate).toISOString()
        }
      } else {
        payload.userId = user.id
        if (taskData.dueDate) {
          payload.dueDate = new Date(taskData.dueDate).toISOString()
        }
      }

      const url = payload.projectId ? '/api/tasks' : '/api/tasks/personal'

      const response = await authFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Task creation failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to create task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task created successfully' })

        // For personal tasks, add to local state immediately for instant feedback
        if (!payload.projectId) {
          const newPersonalTask = {
            ...data.data,
            dueDate: data.data.dueDate || null,
            createdAt: data.data.createdAt || new Date().toISOString(),
            updatedAt: data.data.updatedAt || new Date().toISOString(),
            completedAt: data.data.completedAt || null,
          }
          setPersonalTasks([newPersonalTask, ...personalTasks])
        }

        // Refresh tasks
        if (payload.projectId) {
          fetchProjectTasks(payload.projectId)
        } else {
          await fetchPersonalTasks()
        }
        setShowTaskDialog(false)
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to create task'
        console.error('Task creation error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create task'
      console.error('Task creation exception:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, createTask: false }))
    }
  }

  const handleEditTaskSave = async (taskData: any) => {
    if (!user || !editingTask) return

    try {
      setLoading(prev => ({ ...prev, updateTask: true }))

      // Validate required fields
      if (!taskData.title || taskData.title.trim().length === 0) {
        toast({ title: 'Validation Error', description: 'Task title is required', variant: 'destructive' })
        return
      }

      const payload: any = {
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : null,
        priority: taskData.priority || 'MEDIUM',
        status: taskData.status || 'TODO',
      }

      if (taskData.dueDate) {
        payload.dueDate = new Date(taskData.dueDate).toISOString()
      }

      const url = editingTask.projectId ? `/api/tasks?id=${editingTask.id}` : `/api/tasks/personal?id=${editingTask.id}&userId=${user.id}`
      const body = { ...payload }
      if (editingTask.projectId) {
        body.projectId = editingTask.projectId
      }

      const response = await authFetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Task update failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task updated successfully' })
        // Update local state immediately for instant feedback
        const updatedTask = { ...editingTask, ...payload }
        if (viewType === 'personal') {
          setPersonalTasks(personalTasks.map(t => t.id === editingTask.id ? updatedTask : t))
        } else {
          setProjectTasks(projectTasks.map(t => t.id === editingTask.id ? updatedTask : t))
        }
        setEditingTask(null)
        setShowTaskDialog(false)
        // Refresh tasks in background
        if (editingTask.projectId) {
          fetchProjectTasks(editingTask.projectId)
        } else {
          await fetchPersonalTasks()
        }
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to update task'
        console.error('Task update error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update task'
      console.error('Task update exception:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, updateTask: false }))
    }
  }

  const handleKanbanDragEnd = async (task: KanbanTask, newStatus: string) => {
    if (!user || task.status === newStatus) return

    try {
      setLoading(prev => ({ ...prev, updateTask: true }))

      // Use REST API endpoint with task ID in path
      const url = `/api/tasks/${task.id}`
      const body = {
        status: newStatus,
      }

      console.log('[handleKanbanDragEnd] Updating task:', { taskId: task.id, newStatus, url })

      const response = await authFetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      console.log('[handleKanbanDragEnd] Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[handleKanbanDragEnd] Update task status failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update task status (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        setLoading(prev => ({ ...prev, updateTask: false }))
        return
      }

      const data = await response.json()
      console.log('[handleKanbanDragEnd] Response data:', data)

      if (data.success) {
        toast({ title: 'Success', description: `Task moved to ${newStatus.replace('_', ' ')}` })

        // Update local state immediately for instant feedback
        const updatedTask = { ...task, status: newStatus as any }
        if (viewType === 'personal') {
          setPersonalTasks(personalTasks.map(t => t.id === task.id ? updatedTask : t))
        } else {
          setProjectTasks(projectTasks.map(t => t.id === task.id ? updatedTask : t))
        }
        // Also update combined tasks
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to update task status'
        console.error('Update task status error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update task status'
      console.error('Drag and drop error:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, updateTask: false }))
    }
  }

  const handleTaskDelete = async (task: KanbanTask) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    if (!user) return

    try {
      setLoading(prev => ({ ...prev, updateTask: true }))

      const url = task.projectId ? `/api/tasks/${task.id}` : `/api/tasks/personal?id=${task.id}&userId=${user.id}`

      const response = await authFetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete task failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to delete task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      // Update local state immediately regardless of response for instant feedback
      if (viewType === 'personal') {
        setPersonalTasks(personalTasks.filter(t => t.id !== task.id))
      } else {
        setProjectTasks(projectTasks.filter(t => t.id !== task.id))
      }

      if (data.success) {
        toast({ title: 'Success', description: 'Task deleted successfully' })
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to delete task'
        console.error('Delete task error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete task'
      console.error('Delete task exception:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, updateTask: false }))
    }
  }

  const handleViewTask = (taskId: string, projectId: string) => {
    // For now, just show a message
    toast({
      title: 'View Task',
      description: 'Task details view - Coming soon!',
    })
  }

  const handleDeleteLeaveRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave request?')) return

    try {
      const response = await authFetch(`/api/leave-requests/${id}`, {
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

            {/* New Features Section */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Leaderboards */}
              <LeaderboardPreview compact={true} />

              {/* Project Needs */}
              <NeedsPreview compact={true} />

              {/* Practice Ground */}
              <PracticeGround compact={true} />
            </div>
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
            {/* New Work Session Timer with Pause/Resume and all session types */}
            <WorkSessionTimer onSessionComplete={() => { fetchTimeEntries(); fetchTimeSummary(); }} />

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

            {/* Time Overview by Projects */}
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Time Overview by Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeSummary ? (
                  <div className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{timeSummary.totalHours.toFixed(1)}h</p>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                      </div>
                      <div className="text-center p-4 bg-orange-500/5 rounded-lg">
                        <p className="text-2xl font-bold">{timeSummary.weeklyHours.toFixed(1)}h</p>
                        <p className="text-sm text-muted-foreground">This Week</p>
                      </div>
                      <div className="text-center p-4 bg-green-500/5 rounded-lg">
                        <p className="text-2xl font-bold">{timeSummary.monthlyHours.toFixed(1)}h</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                        <p className="text-2xl font-bold">{timeSummary.totalEntries}</p>
                        <p className="text-sm text-muted-foreground">Total Entries</p>
                      </div>
                    </div>

                    {/* Project Breakdown */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <h3 className="font-semibold text-lg">Time by Project</h3>
                      {timeSummary.projectSummaries && timeSummary.projectSummaries.length > 0 ? (
                        timeSummary.projectSummaries.map((summary: any) => (
                          <div
                            key={summary.project.id}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{summary.project.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {summary.totalEntries} {summary.totalEntries === 1 ? 'entry' : 'entries'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{summary.totalHours.toFixed(1)}h</p>
                              <Badge variant="outline" className="text-xs">
                                {summary.project.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No time tracked yet</p>
                          <p className="text-sm">Start tracking time to see project breakdown</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                    <p>Loading time overview...</p>
                  </div>
                )}
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

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Tasks Board
                  </CardTitle>
                  {/* View Type Toggle */}
                  <Tabs value={viewType} onValueChange={(val) => setViewType(val as 'personal' | 'project')} className="bg-muted/50">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="personal" className="data-[state=active]:bg-background">
                        <User className="h-4 w-4 mr-2" />
                        Personal Tasks
                      </TabsTrigger>
                      <TabsTrigger value="project" className="data-[state=active]:bg-background">
                        <Building className="h-4 w-4 mr-2" />
                        Project Tasks
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Project Selector - only show for project view */}
                  {viewType === 'project' && (
                    <select
                      className="px-3 py-1.5 text-sm border rounded-md bg-background"
                      value={selectedProject?.id || ''}
                      onChange={(e) => setSelectedProject(availableProjects.find(p => p.id === e.target.value) || null)}
                    >
                      <option value="">Select Project</option>
                      {availableProjects.map((project: any) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  )}

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
                {loading.tasks && (viewType === 'personal' ? personalTasks.length === 0 : projectTasks.length === 0) ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (viewType === 'personal' ? personalTasks : projectTasks).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
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
                ) : (
                  <ProfessionalKanbanBoard
                    tasks={viewType === 'personal' ? personalTasks : projectTasks}
                    onDragEnd={handleKanbanDragEnd}
                    onTaskEdit={(task) => setEditingTask(task)}
                    onTaskDelete={handleTaskDelete}
                    loading={loading.updateTask}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Task Dialog */}
      <TaskFormDialog
        open={showTaskDialog || !!editingTask}
        onOpenChange={(open) => {
          if (!open) {
            setShowTaskDialog(false)
            setEditingTask(null)
          } else {
            setShowTaskDialog(true)
          }
        }}
        onSave={editingTask ? handleEditTaskSave : handleCreateTask}
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
        projects={availableProjects}
        loading={loading.createTask || loading.updateTask}
      />

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

export default function StudentDashboard() {
  const { user } = useAuth()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-transparent"></div>
      </div>
    }>
      <VerificationGate user={user} restrictActions={true} showBadge={true}>
        <DashboardContent user={user} />
      </VerificationGate>
    </Suspense>
  )
}
