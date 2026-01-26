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
import ProfessionalKanbanBoard, { Task as KanbanTask } from '@/components/task/ProfessionalKanbanBoard'
import TaskFormDialog from '@/components/task/TaskFormDialog'
import {
  ArrowLeft,
  Plus,
  Building2,
  Users,
  Calendar,
  Loader2,
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

export default function ProjectTasksPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<KanbanTask[]>([])
  const [loading, setLoading] = useState({
    project: true,
    tasks: true,
    update: false,
  })
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchProjectTasks()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      setLoading(prev => ({ ...prev, project: true }))
      const response = await authFetch(`/api/projects/${projectId}`)
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
      const response = await authFetch(`/api/tasks?projectId=${projectId}`)
      const data = await response.json()

      if (data.success) {
        setTasks(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch tasks',
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

  const handleCreateTask = async (taskData: any) => {
    if (!user || !projectId) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const payload = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: taskData.status || 'TODO',
        projectId: projectId,
        assignedTo: user.id,
        assignedBy: user.id,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      }

      const response = await authFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create task failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to create task (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success || data.task) {
        toast({ title: 'Success', description: 'Task created successfully' })
        setShowTaskDialog(false)
        fetchProjectTasks()
      } else {
        toast({ title: 'Error', description: data.error || data.message || 'Failed to create task', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create task', variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleEditTaskSave = async (taskData: any) => {
    if (!user || !editingTask) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const payload = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: taskData.status,
        projectId: editingTask.projectId || projectId,
      }

      if (taskData.dueDate) {
        payload.dueDate = new Date(taskData.dueDate).toISOString()
      }

      const response = await authFetch(`/api/tasks?id=${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update task failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to update task (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: 'Task updated successfully' })
        // Update local state immediately for instant feedback
        const updatedTask = { ...editingTask, ...payload }
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
        setEditingTask(null)
        setShowTaskDialog(false)
        fetchProjectTasks()
      } else {
        toast({ title: 'Error', description: data.error || data.message || 'Failed to update task', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleKanbanDragEnd = async (task: KanbanTask, newStatus: string) => {
    if (!user || task.status === newStatus) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const response = await authFetch(`/api/tasks?id=${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          projectId: projectId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: `Task moved to ${newStatus.replace('_', ' ')}` })
        // Update local state immediately for instant feedback
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t))
      } else {
        toast({ title: 'Error', description: data.error || data.message || 'Failed to update task status', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update task status', variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleTaskDelete = async (task: KanbanTask) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    if (!user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const response = await authFetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete task failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to delete task (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      // Update local state immediately regardless of response for instant feedback
      setTasks(tasks.filter(t => t.id !== task.id))

      if (data.success) {
        toast({ title: 'Success', description: 'Task deleted successfully' })
      } else {
        toast({ title: 'Error', description: data.error || data.message || 'Failed to delete task', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/projects/${projectId}`} className="cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Project
                </Link>
              </Button>
              {loading.project ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading project...</span>
                </div>
              ) : project ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">{project.name}</h1>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    )}
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-4">
                    {project.members && project.members.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{project.members.length} members</span>
                      </div>
                    )}
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                </div>
              ) : null}
            </div>
            <Button
              onClick={() => setShowTaskDialog(true)}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Project Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading.tasks && tasks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Create your first task to start tracking progress for this project.
                </p>
                <Button
                  onClick={() => setShowTaskDialog(true)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              </div>
            ) : (
              <ProfessionalKanbanBoard
                tasks={tasks}
                onDragEnd={handleKanbanDragEnd}
                onTaskEdit={(task) => setEditingTask(task)}
                onTaskDelete={handleTaskDelete}
                loading={loading.update}
              />
            )}
          </CardContent>
        </Card>
      </main>

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
        loading={loading.update}
      />
    </div>
  )
}
