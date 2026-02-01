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
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; email?: string }>>([])
  const [loading, setLoading] = useState({
    project: true,
    tasks: true,
    users: true,
    update: false,
  })
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchProjectTasks()
      fetchAvailableUsers()
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

  const fetchAvailableUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }))
      // Fetch project members
      const response = await authFetch(`/api/projects/${projectId}/members`)
      const data = await response.json()

      if (data.success && data.data && data.data.members) {
        const members = data.data.members.map((member: any) => ({
          id: member.user?.id || member.userId,
          name: member.user?.name || member.user?.email || 'Unknown',
          email: member.user?.email,
        }))
        setAvailableUsers(members)
      } else {
        // Fallback to all users if project members fetch fails
        const allUsersResponse = await authFetch('/api/users')
        const allUsersData = await allUsersResponse.json()
        if (allUsersData.success && allUsersData.data) {
          const users = allUsersData.data.map((u: any) => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
          }))
          setAvailableUsers(users)
        }
      }
    } catch (error) {
      console.error('Fetch available users error:', error)
      // Don't show toast for this error, just log it
      setAvailableUsers([])
    } finally {
      setLoading(prev => ({ ...prev, users: false }))
    }
  }

  const handleCreateTask = async (taskData: any) => {
    if (!user || !projectId) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const payload: any = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: taskData.status || 'TODO',
        projectId: projectId,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      }

      // Only include assigneeId if a user is selected
      if (taskData.assigneeId && taskData.assigneeId !== 'none' && taskData.assigneeId !== '') {
        payload.assigneeId = taskData.assigneeId
      } else {
        payload.assigneeId = undefined // Don't auto-assign
      }

      const response = await authFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create task failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to create task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success || data.task) {
        toast({ title: 'Success', description: 'Task created successfully' })
        setShowTaskDialog(false)
        fetchProjectTasks()
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to create task'
        console.error('Create task error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create task'
      console.error('Create task exception:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleEditTaskSave = async (taskData: any) => {
    if (!user || !editingTask) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const payload: any = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: taskData.status,
        projectId: editingTask.projectId || projectId,
      }

      if (taskData.dueDate) {
        payload.dueDate = new Date(taskData.dueDate).toISOString()
      }

      // Only include assigneeId if a user is selected
      if (taskData.assigneeId && taskData.assigneeId !== 'none' && taskData.assigneeId !== '') {
        payload.assigneeId = taskData.assigneeId
      }

      const response = await authFetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update task failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
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
        const errorMsg = data.error || data.message || data.details || 'Failed to update task'
        console.error('Update task error:', data)
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update task'
      console.error('Update task exception:', err)
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
      throw err
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleKanbanDragEnd = async (task: KanbanTask, newStatus: string) => {
    if (!user || task.status === newStatus) return

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const response = await authFetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update task status failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update task status (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        setLoading(prev => ({ ...prev, update: false }))
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({ title: 'Success', description: `Task moved to ${newStatus.replace('_', ' ')}` })
        // Update local state immediately for instant feedback
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t))
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
        const errorMsg = errorText || `Failed to delete task (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      // Update local state immediately regardless of response for instant feedback
      setTasks(tasks.filter(t => t.id !== task.id))

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
        availableUsers={availableUsers}
      />
    </div>
  )
}
