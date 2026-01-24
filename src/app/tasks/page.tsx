'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  LayoutDashboard,
  ListTodo,
  Briefcase,
  Timer,
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Search,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  Calendar,
  MessageSquare,
  User,
  Building2,
  LayoutGrid,
  List,
  Settings,
  Trash2,
  Send,
  ClipboardList,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

// Types
interface Project {
  id: string
  name: string
  description?: string
}

interface PersonalTask {
  id: string
  userId: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

interface ProjectTask {
  id: string
  projectId: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  assignedTo: string | null
  assignedBy: string
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  currentStepId: string | null
}

interface TaskComment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: string
  accessLevel: 'OWNER' | 'PROJECT_MANAGER' | 'VIEW' | 'COMMENT'
  joinedAt: string
}

function TasksContent({ user }: { user: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const initialProjectId = searchParams.get('projectId')

  const [activeTab, setActiveTab] = useState(tabFromUrl || 'tasks')
  const [viewType, setViewType] = useState<'personal' | 'project'>(initialProjectId ? 'project' : 'personal')
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([])
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedTask, setSelectedTask] = useState<PersonalTask | ProjectTask | null>(null)
  const [comments, setComments] = useState<TaskComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for creating tasks
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    dueDate: '',
  })

  // Fetch data on mount
  useEffect(() => {
    // Redirect to student dashboard with tasks tab active
    router.push('/dashboard/student?tab=tasks')
  }, [])

  // Keep the rest of the component for any direct navigation
  useEffect(() => {
    if (user) {
      fetchPersonalTasks()
      fetchProjects()
    }
  }, [user])

  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject.id)
    }
  }, [selectedProject])

  // Sync with student dashboard URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value !== 'tasks') {
      router.push(`/dashboard/student?tab=${value}`)
    } else {
      router.push('/tasks?tab=tasks')
    }
  }

  const fetchPersonalTasks = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/tasks/personal?userId=${user.id}`)
      if (!response.ok) throw new Error('Failed to fetch personal tasks')
      const data = await response.json()
      setPersonalTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load personal tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjectTasks = async (projectId: string) => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/tasks?projectId=${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project tasks')
      const data = await response.json()
      setProjectTasks(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      const projectList = data.data || []
      setProjects(projectList)

      // If initialProjectId is in URL, select that project
      if (initialProjectId && projectList.length > 0) {
        const projectToSelect = projectList.find(p => p.id === initialProjectId)
        if (projectToSelect) {
          setSelectedProject(projectToSelect)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/comments?taskId=${taskId}`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.data || [])
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  const handleCreateTask = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const payload = {
        assigneeId: user.id,
        assignedBy: user.id,
        title: taskForm.title,
        description: taskForm.description || null,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : null,
      }

      const url = viewType === 'personal'
        ? `/api/tasks/personal?userId=${user.id}`
        : `/api/tasks?projectId=${selectedProject?.id}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: taskForm.title,
          description: taskForm.description || null,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create task')

      const data = await response.json()

      if (data.success || data.task) {
        toast({ title: 'Success', description: 'Task created successfully' })
        
        if (viewType === 'personal') {
          fetchPersonalTasks()
        } else {
          if (selectedProject) {
            fetchProjectTasks(selectedProject.id)
          }
        }

        setIsCreateDialogOpen(false)
        setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
        setError(null)
      } else {
        setError(data.error || data.message || 'Failed to create task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask || !user) return

    try {
      setIsLoading(true)
      const taskId = selectedTask.id

      const url = viewType === 'personal'
        ? `/api/tasks/personal?id=${taskId}&userId=${user.id}`
        : `/api/tasks?taskId=${taskId}&projectId=${selectedProject?.id}`

      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task deleted successfully' })
        
        if (viewType === 'personal') {
          setPersonalTasks(personalTasks.filter(t => t.id !== taskId))
        } else {
          setProjectTasks(projectTasks.filter(t => t.id !== taskId))
        }

        setIsDeleteDialogOpen(false)
        setSelectedTask(null)
        setError(null)
      } else {
        setError(data.error || data.message || 'Failed to delete task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoveTask = async (task: ProjectTask, newStatus: string) => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          newStepId: newStatus === 'TODO' ? '1' : newStatus === 'IN_PROGRESS' ? '2' : newStatus === 'REVIEW' ? '3' : '4',
          projectId: task.projectId,
        }),
      })

      if (!response.ok) throw new Error('Failed to move task')

      const data = await response.json()
      
      if (data.success || data.task) {
        setProjectTasks(projectTasks.map(t => t.id === task.id ? (data.data || data.task) : t))
        setError(null)
      } else {
        setError(data.error || data.message || 'Failed to move task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim() || !user) return

    try {
      const response = await fetch('/api/tasks/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTask.id,
          userId: user.id,
          content: newComment,
        }),
      })

      if (!response.ok) throw new Error('Failed to add comment')

      const data = await response.json()
      
      if (data.success || data.comment) {
        setComments([...comments, data.data || data.comment])
        setNewComment('')
      } else {
        setError(data.error || data.message || 'Failed to add comment')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    }
  }

  const handleTaskClick = (task: PersonalTask | ProjectTask) => {
    setSelectedTask(task)
    setIsCommentDialogOpen(true)
    fetchComments(task.id)
  }

  // Stats calculations
  const currentTasks = viewType === 'personal' ? personalTasks : projectTasks
  const totalTasks = currentTasks.length
  const completedTasks = currentTasks.filter(t => t.status === 'DONE').length
  const inProgressTasks = currentTasks.filter(t => t.status === 'IN_PROGRESS').length
  const todoTasks = currentTasks.filter(t => t.status === 'TODO').length
  const reviewTasks = currentTasks.filter(t => t.status === 'REVIEW').length
  const highPriorityTasks = currentTasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
      HIGH: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
      MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
      LOW: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    }
    return colors[priority] || colors.MEDIUM
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DONE: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
      TODO: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800',
      REVIEW: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800',
    }
    return colors[status] || colors.TODO
  }

  const columns = [
    { id: 'todo', title: 'To Do', status: 'TODO' },
    { id: 'in-progress', title: 'In Progress', status: 'IN_PROGRESS' },
    { id: 'review', title: 'Review', status: 'REVIEW' },
    { id: 'done', title: 'Done', status: 'DONE' },
  ]

  const getColumnTasks = (columnId: string) => {
    return currentTasks.filter(t => t.status === columns.find(c => c.id === columnId)?.status)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view tasks</p>
          <Link href="/">
            <Button className="mt-4">Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4 sm:space-y-6">
          <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="p-2">
              <TabsList className="bg-transparent h-auto w-full overflow-x-auto flex-wrap p-1 gap-2">
                <TabsTrigger
                  value="dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer font-medium"
                >
                  <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
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
              </TabsList>
            </CardContent>
          </Card>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <LayoutDashboard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Dashboard</h3>
                  <p className="text-muted-foreground mb-6">Navigate to other tabs to manage your tasks, projects, and time tracking.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard/student">
                      <Button size="lg">
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Go to Student Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardContent className="p-4">
                {/* Personal/Project Tasks Sub-tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <Tabs value={viewType} onValueChange={(val) => setViewType(val as 'personal' | 'project')} className="w-full sm:w-auto">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="personal" className="data-[state=active]:bg-background">
                        <User className="h-4 w-4 mr-2" />
                        Personal
                      </TabsTrigger>
                      <TabsTrigger value="project" className="data-[state=active]:bg-background">
                        <Building2 className="h-4 w-4 mr-2" />
                        Project Tasks
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Dynamic controls area - same position for both views */}
                  {viewType === 'personal' ? (
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Personal Task
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <select
                          className="px-3 py-1.5 text-sm border rounded-md bg-background w-full sm:w-auto"
                          value={selectedProject?.id || ''}
                          onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                        >
                          <option value="">Select Project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="flex-shrink-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project Task
                      </Button>
                    </div>
                  )}
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 mb-6 md:grid-cols-5">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Tasks</span>
                      </div>
                      <div className="text-2xl font-bold">{totalTasks}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Circle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">To Do</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{todoTasks}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">In Progress</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Review</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{reviewTasks}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Done</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kanban Board */}
                {isLoading && currentTasks.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                  </div>
                ) : currentTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tasks yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {columns.map((column) => (
                      <div key={column.id} className="bg-muted/30 rounded-lg p-3 min-h-[300px]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-sm flex items-center gap-2">
                            {column.title}
                            <Badge variant="secondary" className="text-xs">
                              {getColumnTasks(column.id).length}
                            </Badge>
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {getColumnTasks(column.id).map((task) => (
                            <Card
                              key={task.id}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleTaskClick(task)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="font-medium text-sm flex-1 line-clamp-2">{task.title}</h4>
                                  <Badge className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-xs">
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status.replace('_', ' ')}
                                  </Badge>
                                  {task.dueDate && (
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
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
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Manage your projects here</p>
                  <Link href="/projects">
                    <Button>
                      Go to Projects Page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Tracking Tab */}
          <TabsContent value="time-tracking" className="space-y-4 sm:space-y-6">
            <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Timer className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Track your time and productivity</p>
                  <Link href="/dashboard/student?tab=time-tracking">
                    <Button>
                      Go to Dashboard Time Tracking
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {viewType === 'personal' ? 'Create Personal Task' : 'Create Project Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  className="px-3 py-2 border rounded-md bg-background w-full"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={!taskForm.title || isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Comments Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Task Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{comment.userId}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-muted-foreground text-sm">No comments yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment()
                  }
                }}
              />
              <Button onClick={handleAddComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function TasksPage() {
  const { user } = useAuth()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-transparent"></div>
      </div>
    }>
      <TasksContent user={user} />
    </Suspense>
  )
}
