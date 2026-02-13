'use client'

import { useState, useEffect, use, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProfessionalKanbanBoard from '@/components/task/ProfessionalKanbanBoard'
import TaskFormDialog from '@/components/task/TaskFormDialog'
import {
  ArrowLeft,
  Plus,
  Building2,
  Users,
  Calendar,
  UserPlus,
  Target,
  Loader2,
  AlertTriangle,
  CircleDot,
  CheckCircle2,
  Edit3,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description?: string
  status: string
  category?: string
  progress?: number
  completionRate?: number
  members?: any[]
  owner?: any
}

interface Milestone {
  id: string
  title: string
  description: string | null
  dueDate: string
  completion: number
  createdAt: string
  completedAt: string | null
  status?: string
  projectId: string
}

interface Vacancy {
  id: string
  projectId: string
  title: string
  description: string | null
  type: string
  skills: string | null
  slots: number
  filled: number
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  projectId?: string | null
  taskAssignees?: Array<{
    id: string
    taskId: string
    userId: string
    user: {
      id: string
      name: string
      avatar?: string
      email?: string
    }
    assignedAt: string
    sortOrder: number
  }>
  subTasks?: Array<{
    id: string
    taskId: string
    title: string
    completed: boolean
    sortOrder: number
  }>
  steps?: Array<{
    id: string
    taskId: string
    stepNumber: string
    name: string
    description: string | null
    movedBy: string
    movedAt: string
  }>
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
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [loading, setLoading] = useState({
    project: true,
    tasks: true,
    members: false,
    milestones: false,
    vacancies: false,
    update: false,
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showAddMilestoneDialog, setShowAddMilestoneDialog] = useState(false)
  const [showEditMilestoneDialog, setShowEditMilestoneDialog] = useState(false)
  const [showAddVacancyDialog, setShowAddVacancyDialog] = useState(false)
  const [showEditVacancyDialog, setShowEditVacancyDialog] = useState(false)

  // Form states
  const [newMember, setNewMember] = useState({ userId: "", email: "", role: "TEAM_MEMBER" })
  const [inviteMode, setInviteMode] = useState<'select' | 'email'>('select')
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", dueDate: "" })
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [newVacancy, setNewVacancy] = useState({
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    expertise: "",
    type: "FULL_TIME",
    slots: 1,
    location: "",
    salaryMin: "",
    salaryMax: "",
    experience: ""
  })
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null)

  useEffect(() => {
    if (projectId2) {
      fetchProject()
      fetchProjectTasks()
      fetchTeamMembers()
      fetchMilestones()
      fetchVacancies()
      fetchAvailableUsers()
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
      if (!response.ok) throw new Error('Failed to fetch project tasks')
      const data = await response.json()
      setTasks(data.data || [])
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
      setLoading(prev => ({ ...prev, members: true }))
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
      setLoading(prev => ({ ...prev, members: false }))
    }
  }

  const fetchMilestones = async () => {
    try {
      setLoading(prev => ({ ...prev, milestones: true }))
      const response = await authFetch(`/api/projects/${projectId2}/milestones`)
      const data = await response.json()
      if (data.success) {
        setMilestones(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch milestones',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch milestones error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch milestones',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, milestones: false }))
    }
  }

  const fetchVacancies = async () => {
    try {
      setLoading(prev => ({ ...prev, vacancies: true }))
      const response = await authFetch(`/api/projects/${projectId2}/vacancies`)
      const data = await response.json()
      if (data.success) {
        setVacancies(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch vacancies',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch vacancies error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch vacancies',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, vacancies: false }))
    }
  }

  const fetchAvailableUsers = async () => {
    try {
      // Fetch project members first
      const response = await authFetch(`/api/projects/${projectId2}/members`)
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
      setAvailableUsers([])
    }
  }

  // Memoize projects array to prevent infinite re-renders
  const projectsForDialog = useMemo(() => {
    return [{ id: projectId2, name: project?.name || '' }]
  }, [projectId2, project?.name])

  const handleCreateTask = async (taskData: any) => {
    if (!project || !taskData.title || !user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const payload = {
        title: taskData.title,
        description: taskData.description || undefined,
        priority: taskData.priority,
        dueDate: taskData.dueDate || undefined,
        projectId: projectId2,
        assigneeIds: taskData.assigneeIds || [],
      }

      const response = await authFetch(`/api/projects/${projectId2}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        const createdTask = data.data
        
        // Create subtasks if provided
        if (taskData.subtasks && Array.isArray(taskData.subtasks) && taskData.subtasks.length > 0) {
          for (const subtask of taskData.subtasks) {
            try {
              await authFetch(`/api/tasks/${createdTask.id}/subtasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: subtask.title,
                  sortOrder: subtask.sortOrder || 0,
                }),
              })
            } catch (error) {
              console.error('Failed to create subtask:', error)
            }
          }
        }
        
        toast({
          title: 'Success',
          description: 'Task created successfully',
        })
        fetchProjectTasks()
        setShowTaskDialog(false)
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

  const handleEditTaskSave = async (taskData: any) => {
    if (!user || !editingTask) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const payload: any = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: taskData.status,
        projectId: editingTask.projectId || projectId2,
        assigneeIds: Array.isArray(taskData.assigneeIds) 
          ? taskData.assigneeIds 
          : (taskData.taskAssignees?.map((ta: any) => ta.userId) || []),
        subtasks: taskData.subtasks,
      }

      if (taskData.dueDate) {
        payload.dueDate = new Date(taskData.dueDate).toISOString()
      }

      const response = await authFetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        })
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

    if (task.status === newStatus) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await authFetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
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

  const handleAddMilestone = async () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Title and due date are required',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/projects/${projectId2}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId2,
          title: newMilestone.title,
          description: newMilestone.description || undefined,
          dueDate: newMilestone.dueDate,
          status: 'NOT_STARTED',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create milestone failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to create milestone (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        await fetchMilestones()
        setNewMilestone({ title: "", description: "", dueDate: "" })
        setShowAddMilestoneDialog(false)
        toast({
          title: 'Success',
          description: 'Milestone created successfully',
        })
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to create milestone'
        console.error('Create milestone error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create milestone'
      console.error('Create milestone exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleEditMilestone = async (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setNewMilestone({
      title: milestone.title,
      description: milestone.description || "",
      dueDate: milestone.dueDate,
    })
    setShowEditMilestoneDialog(true)
  }

  const handleUpdateMilestone = async () => {
    if (!editingMilestone || !user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/milestones/${editingMilestone.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newMilestone.title,
          description: newMilestone.description || undefined,
          dueDate: newMilestone.dueDate,
          status: editingMilestone.status,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update milestone failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update milestone (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        await fetchMilestones()
        setShowEditMilestoneDialog(false)
        setEditingMilestone(null)
        setNewMilestone({ title: "", description: "", dueDate: "" })
        toast({
          title: 'Success',
          description: 'Milestone updated successfully',
        })
      } else {
        const errorMsg = data.error || data.message || 'Failed to update milestone'
        console.error('Update milestone error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update milestone'
      console.error('Update milestone exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleDeleteMilestone = async (milestone: Milestone) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/milestones/${milestone.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete milestone failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to delete milestone (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Milestone deleted successfully',
        })
        await fetchMilestones()
      } else {
        const errorMsg = data.error || data.message || 'Failed to delete milestone'
        console.error('Delete milestone error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete milestone'
      console.error('Delete milestone exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleAddVacancy = async () => {
    if (!newVacancy.title || !newVacancy.slots) {
      toast({
        title: 'Validation Error',
        description: 'Title and slots are required',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(prev => ({ ...prev, update: true }))

      const response = await authFetch(`/api/projects/${projectId2}/vacancies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newVacancy.title,
          description: newVacancy.description,
          responsibilities: newVacancy.responsibilities,
          requirements: newVacancy.requirements,
          expertise: newVacancy.expertise,
          location: newVacancy.location,
          salaryMin: newVacancy.salaryMin ? parseFloat(newVacancy.salaryMin) : undefined,
          salaryMax: newVacancy.salaryMax ? parseFloat(newVacancy.salaryMax) : undefined,
          type: newVacancy.type,
          skills: newVacancy.skills,
          slots: parseInt(newVacancy.slots.toString()),
          experience: newVacancy.experience || 'Not specified',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create vacancy failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to create vacancy (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        await fetchVacancies()
        setNewVacancy({
          title: "",
          description: "",
          responsibilities: "",
          requirements: "",
          skills: "",
          expertise: "",
          type: "FULL_TIME",
          slots: 1,
          location: "",
          salaryMin: "",
          salaryMax: "",
          experience: ""
        })
        setShowAddVacancyDialog(false)
        toast({
          title: 'Success',
          description: 'Vacancy created successfully',
        })
      } else {
        const errorMsg = data.error || data.message || data.details || 'Failed to create vacancy'
        console.error('Create vacancy error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create vacancy'
      console.error('Create vacancy exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleEditVacancy = async (vacancy: Vacancy) => {
    setEditingVacancy(vacancy)
    setNewVacancy({
      title: vacancy.title,
      description: vacancy.description || "",
      responsibilities: vacancy.responsibilities || "",
      requirements: vacancy.requirements || "",
      skills: vacancy.skills || "",
      expertise: vacancy.expertise || "",
      type: vacancy.type,
      slots: vacancy.slots,
      location: vacancy.location || "",
      salaryMin: vacancy.salaryMin ? vacancy.salaryMin.toString() : "",
      salaryMax: vacancy.salaryMax ? vacancy.salaryMax.toString() : "",
      experience: vacancy.experience || "",
    })
    setShowEditVacancyDialog(true)
  }

  const handleUpdateVacancy = async () => {
    if (!editingVacancy || !user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/vacancies/${editingVacancy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newVacancy.title,
          description: newVacancy.description || undefined,
          responsibilities: newVacancy.responsibilities || undefined,
          requirements: newVacancy.requirements || undefined,
          expertise: newVacancy.expertise || undefined,
          location: newVacancy.location || undefined,
          salaryMin: newVacancy.salaryMin ? parseFloat(newVacancy.salaryMin) : undefined,
          salaryMax: newVacancy.salaryMax ? parseFloat(newVacancy.salaryMax) : undefined,
          type: newVacancy.type,
          skills: newVacancy.skills || undefined,
          slots: parseInt(newVacancy.slots.toString()),
          experience: newVacancy.experience || undefined,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update vacancy failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to update vacancy (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        await fetchVacancies()
        setShowEditVacancyDialog(false)
        setEditingVacancy(null)
        setNewVacancy({
          title: "",
          description: "",
          responsibilities: "",
          requirements: "",
          skills: "",
          expertise: "",
          type: "FULL_TIME",
          slots: 1,
          location: "",
          salaryMin: "",
          salaryMax: "",
          experience: ""
        })
        toast({
          title: 'Success',
          description: 'Vacancy updated successfully',
        })
      } else {
        const errorMsg = data.error || data.message || 'Failed to update vacancy'
        console.error('Update vacancy error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update vacancy'
      console.error('Update vacancy exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleDeleteVacancy = async (vacancy: Vacancy) => {
    if (!confirm('Are you sure you want to delete this vacancy?')) return
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, update: true }))
      const response = await authFetch(`/api/vacancies/${vacancy.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete vacancy failed:', response.status, errorText)
        const errorMsg = errorText || `Failed to delete vacancy (${response.status})`
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Vacancy deleted successfully',
        })
        await fetchVacancies()
      } else {
        const errorMsg = data.error || data.message || 'Failed to delete vacancy'
        console.error('Delete vacancy error:', data)
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete vacancy'
      console.error('Delete vacancy exception:', error)
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleAddMember = async () => {
    // Validate based on invite mode
    if (inviteMode === 'select' && !newMember.userId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a user to add',
        variant: 'destructive',
      })
      return
    }

    if (inviteMode === 'email' && !newMember.email) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(prev => ({ ...prev, update: true }))

      // Use invite endpoint which supports both userId and email
      const payload: any = {
        role: newMember.role,
      }

      if (inviteMode === 'select') {
        payload.userId = newMember.userId
      } else {
        payload.email = newMember.email
      }

      const response = await authFetch(`/api/projects/${projectId2}/members/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchTeamMembers()
        setNewMember({ userId: "", email: "", role: "TEAM_MEMBER" })
        setShowAddMemberDialog(false)
        toast({
          title: 'Success',
          description: data.message || 'Team member added successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Failed to add team member',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Add team member error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add team member',
        variant: 'destructive',
      })
    } finally {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Sticky Header with Blur Glass Effect */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
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

      {/* Main Content with Tabs */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              <Building2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-background">
              <Users className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-background">
              <Target className="h-4 w-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-background">
              <UserPlus className="h-4 w-4 mr-2" />
              Team & Roles
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="data-[state=active]:bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              Vacancies
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {loading.project ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : project && (
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">Project Overview</CardTitle>
                    <Badge>{getStatusBadge(project.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <Building2 className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-sm font-medium">Progress</h3>
                      <div className="text-2xl font-bold text-primary mt-2">{Math.round(project.completionRate || 0)}%</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                      <h3 className="text-sm font-medium">Team</h3>
                      <div className="text-2xl font-bold text-blue-600 mt-2">{teamMembers.length}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <Target className="h-8 w-8 text-purple-500 mb-2" />
                      <h3 className="text-sm font-medium">Milestones</h3>
                      <div className="text-2xl font-bold text-purple-600 mt-2">{milestones.length}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <Calendar className="h-8 w-8 text-emerald-500 mb-2" />
                      <h3 className="text-sm font-medium">Vacancies</h3>
                      <div className="text-2xl font-bold text-emerald-600 mt-2">{vacancies.filter(v => v.filled < v.slots).length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <Button onClick={() => setShowTaskDialog(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.tasks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No tasks yet</p>
                    <Button onClick={() => setShowTaskDialog(true)} variant="outline">
                      Create Your First Task
                    </Button>
                  </div>
                ) : (
                  <ProfessionalKanbanBoard
                    tasks={tasks}
                    onDragEnd={handleMoveTask}
                    onTaskClick={() => {}}
                    onTaskEdit={(task) => setEditingTask(task)}
                    onTaskDelete={handleTaskDelete}
                    loading={loading.update}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6 mt-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Milestones</CardTitle>
                  <Button onClick={() => setShowAddMilestoneDialog(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.milestones ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading milestones...</p>
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-16">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No milestones yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {milestones.map(milestone => (
                      <div key={milestone.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{milestone.title}</p>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={milestone.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {milestone.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-accent"
                              onClick={() => handleEditMilestone(milestone)}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDeleteMilestone(milestone)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Due: {formatDate(milestone.dueDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team & Roles Tab */}
          <TabsContent value="team" className="space-y-6 mt-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button onClick={() => setShowAddMemberDialog(true)} size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.members ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading team...</p>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No team members yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200">
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {member.user?.name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{member.user?.email || ''}</p>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vacancies Tab */}
          <TabsContent value="vacancies" className="space-y-6 mt-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vacancies</CardTitle>
                  <Button onClick={() => setShowAddVacancyDialog(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vacancy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.vacancies ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading vacancies...</p>
                  </div>
                ) : vacancies.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No vacancies yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vacancies.map(vacancy => (
                      <div key={vacancy.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{vacancy.title}</p>
                            {vacancy.description && (
                              <p className="text-sm text-muted-foreground mt-1">{vacancy.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{vacancy.type}</Badge>
                              <Badge variant="secondary">{vacancy.filled}/{vacancy.slots}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-accent"
                              onClick={() => handleEditVacancy(vacancy)}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDeleteVacancy(vacancy)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Milestone Dialog */}
      <Dialog open={showAddMilestoneDialog} onOpenChange={setShowAddMilestoneDialog}>
        <DialogContent className="bg-white dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="Enter milestone title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Enter milestone description"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMilestoneDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMilestone} disabled={loading.update}>
              {loading.update ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Milestone Dialog */}
      <Dialog open={showEditMilestoneDialog} onOpenChange={(open) => {
        if (!open) {
          setShowEditMilestoneDialog(false)
          setEditingMilestone(null)
          setNewMilestone({ title: "", description: "", dueDate: "" })
        }
      }}>
        <DialogContent className="bg-white dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="Enter milestone title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Enter milestone description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditMilestoneDialog(false)
              setEditingMilestone(null)
              setNewMilestone({ title: "", description: "", dueDate: "" })
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMilestone} disabled={loading.update}>
              {loading.update ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vacancy Dialog */}
      <Dialog open={showAddVacancyDialog} onOpenChange={setShowAddVacancyDialog}>
        <DialogContent className="bg-white dark:bg-slate-950 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Vacancy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Position Title *</Label>
              <Input
                id="title"
                value={newVacancy.title}
                onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="description">Overview *</Label>
              <Textarea
                id="description"
                value={newVacancy.description}
                onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                placeholder="Brief overview of the role..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="responsibilities">Job Responsibilities *</Label>
              <Textarea
                id="responsibilities"
                value={newVacancy.responsibilities}
                onChange={(e) => setNewVacancy({ ...newVacancy, responsibilities: e.target.value })}
                placeholder="• Lead development team&#10;• Design and implement features&#10;• Code reviews and mentoring"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                value={newVacancy.requirements}
                onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                placeholder="• 5+ years experience in React/Next.js&#10;• Strong TypeScript skills&#10;• Experience with PostgreSQL"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={newVacancy.skills}
                  onChange={(e) => setNewVacancy({ ...newVacancy, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>
              <div>
                <Label htmlFor="expertise">Area of Expertise</Label>
                <Input
                  id="expertise"
                  value={newVacancy.expertise}
                  onChange={(e) => setNewVacancy({ ...newVacancy, expertise: e.target.value })}
                  placeholder="e.g., Frontend Development"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={newVacancy.experience} onValueChange={(value) => setNewVacancy({ ...newVacancy, experience: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    <SelectItem value="Lead">Lead / Manager</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newVacancy.location}
                  onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={newVacancy.salaryMin}
                  onChange={(e) => setNewVacancy({ ...newVacancy, salaryMin: e.target.value })}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={newVacancy.salaryMax}
                  onChange={(e) => setNewVacancy({ ...newVacancy, salaryMax: e.target.value })}
                  placeholder="e.g., 80000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Employment Type *</Label>
                <Select value={newVacancy.type} onValueChange={(value) => setNewVacancy({ ...newVacancy, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="slots">Number of Positions *</Label>
                <Input
                  id="slots"
                  type="number"
                  min="1"
                  value={newVacancy.slots}
                  onChange={(e) => setNewVacancy({ ...newVacancy, slots: parseInt(e.target.value) || 1 })}
                  placeholder="Number of positions"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVacancyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVacancy} disabled={loading.update}>
              {loading.update ? 'Creating...' : 'Create Vacancy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vacancy Dialog */}
      <Dialog open={showEditVacancyDialog} onOpenChange={(open) => {
        if (!open) {
          setShowEditVacancyDialog(false)
          setEditingVacancy(null)
          setNewVacancy({
            title: "",
            description: "",
            responsibilities: "",
            requirements: "",
            skills: "",
            expertise: "",
            type: "FULL_TIME",
            slots: 1,
            location: "",
            salaryMin: "",
            salaryMax: "",
            experience: ""
          })
        }
      }}>
        <DialogContent className="bg-white dark:bg-slate-950 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vacancy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Position Title *</Label>
              <Input
                id="edit-title"
                value={newVacancy.title}
                onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newVacancy.description}
                onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                placeholder="Describe the role and responsibilities..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-responsibilities">Responsibilities</Label>
              <Textarea
                id="edit-responsibilities"
                value={newVacancy.responsibilities}
                onChange={(e) => setNewVacancy({ ...newVacancy, responsibilities: e.target.value })}
                placeholder="List key responsibilities"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-requirements">Requirements</Label>
              <Textarea
                id="edit-requirements"
                value={newVacancy.requirements}
                onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                placeholder="Education, experience, skills needed..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-expertise">Expertise Areas</Label>
              <Input
                id="edit-expertise"
                value={newVacancy.expertise}
                onChange={(e) => setNewVacancy({ ...newVacancy, expertise: e.target.value })}
                placeholder="e.g., Frontend, Backend, AI/ML"
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={newVacancy.location}
                onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
                placeholder="e.g., Remote, On-site, Hybrid"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Employment Type *</Label>
                <Select value={newVacancy.type} onValueChange={(value) => setNewVacancy({ ...newVacancy, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-slots">Number of Positions *</Label>
                <Input
                  id="edit-slots"
                  type="number"
                  min="1"
                  value={newVacancy.slots}
                  onChange={(e) => setNewVacancy({ ...newVacancy, slots: parseInt(e.target.value) || 1 })}
                  placeholder="Number of positions"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-salary-min">Min Salary</Label>
                <Input
                  id="edit-salary-min"
                  type="number"
                  min="0"
                  step="1000"
                  value={newVacancy.salaryMin}
                  onChange={(e) => setNewVacancy({ ...newVacancy, salaryMin: e.target.value })}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label htmlFor="edit-salary-max">Max Salary</Label>
                <Input
                  id="edit-salary-max"
                  type="number"
                  min="0"
                  step="1000"
                  value={newVacancy.salaryMax}
                  onChange={(e) => setNewVacancy({ ...newVacancy, salaryMax: e.target.value })}
                  placeholder="e.g., 100000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-experience">Experience Level</Label>
              <Select value={newVacancy.experience} onValueChange={(value) => setNewVacancy({ ...newVacancy, experience: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                  <SelectItem value="2-4 years">2-4 years</SelectItem>
                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                  <SelectItem value="5+ years">5+ years</SelectItem>
                  <SelectItem value="Not specified">Not specified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditVacancyDialog(false)
              setEditingVacancy(null)
              setNewVacancy({
                title: "",
                description: "",
                responsibilities: "",
                requirements: "",
                skills: "",
                expertise: "",
                type: "FULL_TIME",
                slots: 1,
                location: "",
                salaryMin: "",
                salaryMax: "",
                experience: ""
              })
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateVacancy} disabled={loading.update}>
              {loading.update ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-white dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Invite Mode Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                type="button"
                variant={inviteMode === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInviteMode('select')}
                className="flex-1"
              >
                Select User
              </Button>
              <Button
                type="button"
                variant={inviteMode === 'email' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInviteMode('email')}
                className="flex-1"
              >
                Invite by Email
              </Button>
            </div>

            {/* User Selection Mode */}
            {inviteMode === 'select' ? (
              <div>
                <Label htmlFor="user">User</Label>
                <Select
                  value={newMember.userId}
                  onValueChange={(value) => setNewMember({ ...newMember, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
            )}

            {/* Role Selection */}
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                  <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                  <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddMemberDialog(false)
              setInviteMode('select')
              setNewMember({ userId: "", email: "", role: "TEAM_MEMBER" })
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={loading.update}>
              {loading.update ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Form Dialog */}
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
        projects={projectsForDialog}
        availableUsers={availableUsers}
        loading={loading.update}
      />

      {/* Sticky Footer */}
      <footer className="mt-auto border-t bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            CareerToDo © {new Date().getFullYear()} - Built with Next.js
          </div>
        </div>
      </footer>
    </div>
  )
}
