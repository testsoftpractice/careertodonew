'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ProfessionalKanbanBoard from '@/components/task/ProfessionalKanbanBoard'
import TaskFormDialog from '@/components/task/TaskFormDialog'
import {
  ArrowLeft,
  Plus,
  Building2,
  Users,
  Calendar,
  Loader2,
  AlertTriangle,
  CircleDot,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description?: string
  status: string
  category?: string
  progress?: number
  members?: any[]
  owner?: any
}

export default function ProjectDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const projectId2 = projectId

  const [project, setProject] = useState<Project | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState({
    project: true,
    tasks: true,
    update: false,
  })
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  })

  useEffect(() => {
    if (projectId2) {
      fetchProject()
      fetchProjectTasks()
      fetchTeamMembers()
    }
  }, [projectId2])

  const fetchProject = async () => {
    try {
      setLoading(prev => ({ ...prev, project: true }))
      const response = await authFetch(`/api/projects/${projectId2}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch project error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch project',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, project: false }))
    }
  }

  const fetchProjectTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }))
      const response = await authFetch(`/api/projects/${projectId2}/tasks`)
      const data = await response.json()
      if (data.success) {
        setTasks(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch tasks',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch tasks error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchTeamMembers = async () => {
    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/projects/${projectId2}/members`)
      const data = await response.json()
      if (data.success) {
        setTeamMembers(data.data.members || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch team members',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch team members error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch team members',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleCreateTask = async () => {
    if (!project || !newTask.title || !user) {
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create tasks',
          variant: 'destructive',
        })
      } else if (!newTask.title) {
        toast({
          title: 'Validation Error',
          description: 'Task title is required',
          variant: 'destructive',
        })
      }
      return
    }

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const payload = {
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
        projectId: projectId2,
        assigneeId: undefined,
      }

      const response = await fetch(`/api/projects/${projectId2}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setTasks([...tasks, data.data])
        setNewTask({
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: '',
        })
        setShowTaskDialog(false)
        toast({
          title: 'Success',
          description: 'Task created successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleEditTaskSave = async (task: Task) => {
    if (!user || !editingTask) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const payload = {
        title: task.title,
        description: task.description || null,
        priority: task.priority,
        projectId: editingTask.projectId || projectId2,
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success || data.task) {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        })
        // Update local state immediately for instant feedback
        const updatedTask = { ...editingTask, ...payload }
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
        setEditingTask(null)
        setShowTaskDialog(false)
        fetchProjectTasks()
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Failed to update task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleMoveTask = async (task: Task, newStatus: string) => {
    if (!user || !projectId2 || !project) return

    // Prevent redundant moves
    if (task.status === newStatus) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const token = localStorage.getItem('token')

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `Task moved to ${newStatus.replace(/_/g, ' ')}`,
        })
        // Update local state immediately for instant feedback
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t))
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Failed to move task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Move task error:', error)
      toast({
        title: 'Error',
        description: 'Failed to move task',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleTaskDelete = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    if (!user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const token = localStorage.getItem('token')

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      setTasks(tasks.filter(t => t.id !== task.id))

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Failed to delete task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Delete task error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
    }
    finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      FUNDING: 'bg-purple-100 text-purple-700 border-purple-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300',
      COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      ON_HOLD: 'bg-orange-100 text-orange-700 border-orange-300',
      CANCELLED: 'bg-red-100 text-red-700 border-red-300',
    }

    if (styles[status]) {
      return (
        <Badge variant="outline" className={`text-xs font-semibold ${styles[status]}`}>
          {status.replace(/_/g, ' ')}
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-xs font-semibold">
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getPriorityConfig = (priority: string) => {
    const configs = {
      CRITICAL: {
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'Critical',
      },
      HIGH: {
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'High',
      },
      MEDIUM: {
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: <CircleDot className="w-3 h-3" />,
        label: 'Medium',
      },
      LOW: {
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: <CircleDot className="w-3 h-3" />,
        label: 'Low',
      },
    }

    return configs[priority as keyof typeof configs] || configs.MEDIUM
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            {loading.project ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading project...</span>
              </div>
            ) : project ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <h1 className="text-lg font-semibold">{project.name}</h1>
                    <Badge variant="outline" className="ml-3">
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Project Overview */}
      {loading.project ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : project && (
        <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold mb-2">Overview</h2>
                  <Badge>{getStatusBadge(project.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="h-12 w-12 mb-2">
                      <Building2 className="h-8 w-12 text-primary mb-2" />
                    </div>
                    <h3 className="text-sm font-medium">Project Progress</h3>
                    <div className="text-xs text-muted-foreground">Track completion across all tasks</div>
                    <div className="text-2xl font-bold text-primary mt-2">{Math.round(project.completionRate || 0)}%</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="h-12 w-12 mb-2">
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                    </div>
                    <h3 className="text-sm font-medium">Team Size</h3>
                    <div className="text-2xl font-bold text-blue-600 mt-2">{teamMembers.length}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                    <div className="h-12 w-12 mb-2">
                      <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                    </div>
                    <h3 className="text-sm font-medium">Vacancies</h3>
                    <div className="text-2xl font-bold text-purple-600 mt-2">{vacancies.filter(v => v.filled < v.slots).length}</div>
                    <div className="text-xs text-muted-foreground">Open</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="h-12 w-12 mb-2">
                      <CheckCircle2 className="h-12 w-12 mb-2 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-2">{milestones.filter(m => m.status === 'COMPLETED').length}/{milestones.length}</h3>
                    <div className="text-xs text-muted-foreground">Milestones Done</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Tab - Using Kanban Board */}
            {loading.tasks ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            ) : (
              <ProfessionalKanbanBoard
                tasks={tasks}
                onDragEnd={handleMoveTask}
                onTaskClick={() => setSelectedTask(null)}
                onTaskEdit={handleEditTaskSave}
                onTaskDelete={handleTaskDelete}
                loading={loading.update}
              />
            )}

            {/* Team Members */}
            {loading.update ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading team members...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-12 w-12 mb-2 opacity-50">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                </div>
                <p className="text-sm text-muted-foreground">No team members yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-900/20 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-full">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                          {member.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {member.user?.name}
                            <span className="text-sm text-muted-foreground">
                              ({member.user?.role || 'Team Member'})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Task Dialog */}
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
              loading={loading.update}
            />

            {/* Add Task Button */}
            {user && project && (
              <div className="fixed bottom-6 left-6">
                <Button onClick={() => setShowTaskDialog(true)} className="shadow-lg">
                  <Plus className="h-6 w-6 mr-2" />
                  New Task
                </Button>
              </div>
            )}
      </div>
      )}
    </div>
  )
}

