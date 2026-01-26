'use client'

import { useState, useEffect, Suspense, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Briefcase,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  BarChart3,
  PieChart,
  ArrowLeft,
  Settings,
  Plus,
  X,
  ChevronRight,
  Circle,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import ProfessionalKanbanBoard from '@/components/task/ProfessionalKanbanBoard'

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  email: string
}

interface Vacancy {
  id: string
  title: string
  description: string
  type: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP'
  skills: string[]
  slots: number
  filled: number
}

interface Milestone {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: string
  completedAt?: string
}

interface Task {
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
}

function ProjectDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const { id: projectId } = use(params)
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  const [project, setProject] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview')

  const [showVacancyModal, setShowVacancyModal] = useState(false)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const [newVacancy, setNewVacancy] = useState<Partial<Vacancy>>({
    title: '',
    description: '',
    type: 'FULL_TIME',
    skills: [],
    slots: 1,
    filled: 0,
  })

  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  })

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  })

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${projectId}`)
      const projectData = await projectResponse.json()
      if (projectData.success) {
        setProject(projectData.data)
      }

      // Fetch team members
      const teamResponse = await fetch(`/api/projects/${projectId}/members`)
      const teamData = await teamResponse.json()
      if (teamData.success) {
        setTeamMembers(teamData.data || [])
      }

      // Fetch vacancies
      const vacanciesResponse = await fetch(`/api/projects/${projectId}/vacancies`)
      const vacanciesData = await vacanciesResponse.json()
      if (vacanciesData.success) {
        setVacancies(vacanciesData.data || [])
      }

      // Fetch milestones
      const milestonesResponse = await fetch(`/api/projects/${projectId}/milestones`)
      const milestonesData = await milestonesResponse.json()
      if (milestonesData.success) {
        setMilestones(milestonesData.data || [])
      }

      // Fetch tasks
      const tasksResponse = await fetch(`/api/tasks?projectId=${projectId}`)
      const tasksData = await tasksResponse.json()
      if (tasksData.success) {
        setTasks(tasksData.data || [])
      }
    } catch (error) {
      console.error('Fetch project data error:', error)
      toast({
        title: 'Error',
        description: 'Failed to load project data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVacancy = async () => {
    if (!project || !newVacancy.title) return

    try {
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          ...newVacancy,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVacancies([...vacancies, data.data])
        setNewVacancy({
          title: '',
          description: '',
          type: 'FULL_TIME',
          skills: [],
          slots: 1,
          filled: 0,
        })
        setShowVacancyModal(false)
        toast({
          title: 'Success',
          description: 'Vacancy created successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create vacancy',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Create vacancy error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create vacancy',
        variant: 'destructive',
      })
    }
  }

  const handleCreateMilestone = async () => {
    if (!project || !newMilestone.title) return
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create milestones',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          ...newMilestone,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create milestone failed:', response.status, errorText)
        toast({ title: 'Error', description: `Failed to create milestone (${response.status})`, variant: 'destructive' })
        return
      }

      const data = await response.json()

      if (data.success || data.data) {
        setMilestones([...milestones, data.data || data])
        setNewMilestone({
          title: '',
          description: '',
          status: 'PENDING',
          dueDate: '',
        })
        setShowMilestoneModal(false)
        toast({
          title: 'Success',
          description: 'Milestone created successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Failed to create milestone',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Create milestone error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create milestone',
        variant: 'destructive',
      })
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
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          projectId,
          assigneeId: user.id,
          assignedBy: user.id,
        }),
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
        setShowTaskModal(false)
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
    } catch (error: any) {
      console.error('Create task error:', error)
      let errorMessage = 'Failed to create task'
      if (error.message?.includes('Foreign key constraint')) {
        errorMessage = 'User authentication error. Please log out and log in again.'
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/tasks?taskId=${taskId}&projectId=${projectId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId))
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete task',
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
  }

  const handleMoveTask = async (task: Task, newStatus: string) => {
    try {
      const response = await fetch('/api/tasks/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          newStepId: newStatus === 'TODO' ? '1' : newStatus === 'IN_PROGRESS' ? '2' : newStatus === 'REVIEW' ? '3' : '4',
          projectId,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (data.success || data.task) {
        setTasks(tasks.map(t => t.id === task.id ? (data.data || data.task) : t))
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to move task',
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
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
      case 'ACTIVE':
      case 'COMPLETED':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">{status.replace('_', ' ')}</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-500 hover:bg-red-600">{status.replace('_', ' ')}</Badge>
      case 'UNDER_REVIEW':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{status.replace('_', ' ')}</Badge>
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600">{status.replace('_', ' ')}</Badge>
    }
  }

  const getMilestoneStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Completed</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      case 'PENDING':
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600">Pending</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const calculateProgress = (filled: number, total: number) => {
    return total > 0 ? Math.round((filled / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard/student">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/student">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800 mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusBadge(project.status)}
                  {project.rejectionReason && project.status === 'REJECTED' && (
                    <Badge className="bg-red-100 text-red-700 border-red-300">
                      Rejection Reason: {project.rejectionReason}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{project.title}</h1>
                <p className="text-base text-muted-foreground">{project.description}</p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-3xl font-bold text-primary mb-1">{project.completionRate || 0}%</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{teamMembers.length}</div>
                <div className="text-xs text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-3xl font-bold text-blue-600 mb-1">{vacancies.filter(v => v.filled < v.slots).length}</div>
                <div className="text-xs text-muted-foreground">Open Vacancies</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-3xl font-bold text-purple-600 mb-1">{milestones.filter(m => m.status === 'COMPLETED').length}/{milestones.length}</div>
                <div className="text-xs text-muted-foreground">Milestones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2 inline" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'team'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Team & Roles
          </button>
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'vacancies'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2 inline" />
            Vacancies
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'milestones'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Target className="h-4 w-4 mr-2 inline" />
            Milestones
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 mr-2 inline" />
              Tasks
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-bold text-primary">{project.completionRate || 0}%</span>
                  </div>
                  <Progress value={project.completionRate || 0} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{project.tasksCompleted || 0}</div>
                    <div className="text-xs text-muted-foreground">Tasks Done</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{project.totalPoints || 0}</div>
                    <div className="text-xs text-muted-foreground">Points Earned</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Project Lead</span>
                    <span className="font-medium">{project.projectLead?.name || user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{formatDate(project.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Progress */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Recent Milestones
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowMilestoneModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {milestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No milestones yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {milestones.slice(0, 5).map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="mt-1">
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Team & Roles
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
              <CardDescription>
                {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No team members yet</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {member.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{member.name}</h4>
                          <p className="text-xs text-primary">{member.role}</p>
                        </div>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'vacancies' && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-500" />
                  Open Positions
                </CardTitle>
                <Button size="sm" onClick={() => setShowVacancyModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Vacancy
                </Button>
              </div>
              <CardDescription>
                {vacancies.length} vacancy{vacancies.length !== 1 ? 'ies' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vacancies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No vacancies posted yet</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {vacancies.map((vacancy) => (
                    <div key={vacancy.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          className={`${
                            vacancy.type === 'FULL_TIME' ? 'bg-blue-500' :
                            vacancy.type === 'PART_TIME' ? 'bg-emerald-500' :
                            'bg-purple-500'
                          }`}
                        >
                          {vacancy.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {vacancy.filled}/{vacancy.slots} filled
                        </span>
                      </div>
                      <h4 className="font-semibold text-base mb-2">{vacancy.title}</h4>
                      {vacancy.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{vacancy.description}</p>
                      )}
                      {vacancy.skills && vacancy.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {vacancy.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{calculateProgress(vacancy.filled, vacancy.slots)}%</span>
                        </div>
                        <Progress value={calculateProgress(vacancy.filled, vacancy.slots)} className="h-2" />
                      </div>
                      <Button size="sm" className="w-full">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'milestones' && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Project Milestones
                </CardTitle>
                <Button size="sm" onClick={() => setShowMilestoneModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              <CardDescription>
                {milestones.filter(m => m.status === 'COMPLETED').length} of {milestones.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No milestones set yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          milestone.status === 'COMPLETED' ? 'bg-emerald-500' :
                          milestone.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          'bg-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{milestone.title}</h4>
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                          </div>
                          {milestone.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Completed: {formatDate(milestone.completedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'tasks' && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                    Project Tasks
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} completed
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowTaskModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No tasks yet. Create your first task!</p>
                </div>
              ) : (
                <ProfessionalKanbanBoard
                  tasks={tasks}
                  onDragEnd={handleMoveTask}
                  onTaskDelete={(task) => handleDeleteTask(task.id)}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Vacancy Modal */}
        {showVacancyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowVacancyModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Create Vacancy</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowVacancyModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vacancyTitle">Title *</Label>
                    <Input
                      id="vacancyTitle"
                      value={newVacancy.title}
                      onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                      placeholder="Position title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vacancyType">Type</Label>
                    <select
                      id="vacancyType"
                      value={newVacancy.type}
                      onChange={(e) => setNewVacancy({ ...newVacancy, type: e.target.value as Vacancy['type'] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="slots">Number of Positions</Label>
                    <Input
                      id="slots"
                      type="number"
                      value={newVacancy.slots}
                      onChange={(e) => setNewVacancy({ ...newVacancy, slots: parseInt(e.target.value) })}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vacancyDescription">Description</Label>
                    <Textarea
                      id="vacancyDescription"
                      value={newVacancy.description}
                      onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                      placeholder="Describe the role and requirements..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowVacancyModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateVacancy} className="flex-1">
                      Create Vacancy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Milestone Modal */}
        {showMilestoneModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMilestoneModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Milestone</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowMilestoneModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="milestoneTitle">Title *</Label>
                    <Input
                      id="milestoneTitle"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      placeholder="Milestone name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestoneDescription">Description</Label>
                    <Textarea
                      id="milestoneDescription"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                      placeholder="Describe this milestone..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newMilestone.dueDate}
                      onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowMilestoneModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateMilestone} className="flex-1">
                      Add Milestone
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showTaskModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Task</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowTaskModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Title *</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Describe this task..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskPriority">Priority</Label>
                    <select
                      id="taskPriority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="taskDueDate">Due Date</Label>
                    <Input
                      id="taskDueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowTaskModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask} className="flex-1">
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-transparent"></div>
      </div>
    }>
      <ProjectDetailContent params={params} />
    </Suspense>
  )
}
