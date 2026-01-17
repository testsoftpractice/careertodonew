'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Briefcase,
  Users,
  Calendar,
  Target,
  Plus,
  UserPlus,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Shield,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface ProjectData {
  id: string
  title: string
  description: string
  category: string
  status: string
  projectLead: any
  hrLead: any
  university: any
  members: any[]
  departments: any[]
  tasks: any[]
  milestones: any[]
  investments: any[]
  agreements: any[]
  completionRate: number
  teamSize: number
  seekingInvestment: boolean
  investmentGoal: number | null
  investmentRaised: number | null
  startDate: string | null
  endDate: string | null
  approvalDate: string | null
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [project, setProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${params.id}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found')
        } else {
          setError('Failed to load project')
        }
        return
      }

      const data = await response.json()
      setProject(data.project)
    } catch (err) {
      console.error('Fetch project error:', err)
      setError('An error occurred while loading the project')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PENDING': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'ASSIGNED': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || 'Project not found'}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Project Overview Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.completionRate.toFixed(0)}%</div>
              <Progress value={project.completionRate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.teamSize}</div>
              <p className="text-xs text-muted-foreground mt-1">{project.departments.length} departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.tasks.filter(t => t.status !== 'COMPLETED').length}</div>
              <p className="text-xs text-muted-foreground mt-1">{project.tasks.length} total tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Milestones</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.milestones.filter(m => m.status === 'ACHIEVED').length}</div>
              <p className="text-xs text-muted-foreground mt-1">{project.milestones.length} total milestones</p>
            </CardContent>
          </Card>
        </div>

        {/* Leadership Info */}
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Project Leadership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.projectLead?.avatar} />
                  <AvatarFallback>{project.projectLead?.name?.split(' ').map((n: string) => n[0]).join('') || 'PL'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.projectLead?.name || 'Not assigned'}</div>
                  <div className="text-sm text-muted-foreground">Project Lead</div>
                  <div className="text-xs text-muted-foreground mt-1">{project.projectLead?.email || ''}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.hrLead?.avatar} />
                  <AvatarFallback>{project.hrLead?.name?.split(' ').map((n: string) => n[0]).join('') || 'HR'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.hrLead?.name || 'Not assigned'}</div>
                  <div className="text-sm text-muted-foreground">HR Lead</div>
                  <div className="text-xs text-muted-foreground mt-1">{project.hrLead?.email || ''}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>About This Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{project.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div className="font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">End Date</div>
                    <div className="font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                    <Progress value={project.completionRate} className="mt-2 h-2" />
                    <div className="text-sm font-medium mt-1">{project.completionRate.toFixed(0)}%</div>
                  </div>
                  {project.seekingInvestment && (
                    <div>
                      <div className="text-sm text-muted-foreground">Investment</div>
                      <div className="font-medium">
                        ${project.investmentRaised?.toLocaleString() || 0} raised of ${project.investmentGoal?.toLocaleString() || 0}
                      </div>
                      <Progress value={project.investmentGoal ? ((project.investmentRaised || 0) / project.investmentGoal * 100) : 0} className="mt-2 h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Task
                  </Button>
                  <Button className="w-full" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Milestone
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Milestone Progress</CardTitle>
                <CardDescription>Track key project achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.milestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No milestones yet
                  </div>
                ) : (
                  project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        milestone.status === 'ACHIEVED' ? 'bg-green-500 text-white' : 'bg-muted'
                      }`}>
                        {milestone.status === 'ACHIEVED' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : milestone.status === 'IN_PROGRESS' ? (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {new Date(milestone.targetDate).toLocaleDateString()}
                          {milestone.achievedAt && ` • Achieved: ${new Date(milestone.achievedAt).toLocaleDateString()}`}
                        </div>
                      </div>
                      <Badge variant={milestone.status === 'ACHIEVED' ? 'default' : 'secondary'}>
                        {milestone.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>{project.members.length} members across {project.departments.length} departments</CardDescription>
              </CardHeader>
              <CardContent>
                {project.members.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No team members yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <Avatar>
                          <AvatarImage src={member.user?.avatar} />
                          <AvatarFallback>{member.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{member.user?.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                        <Badge>{member.user?.progressionLevel || 'CONTRIBUTOR'}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
                <CardDescription>{project.tasks.length} tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {project.tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.assignee?.name || 'Unassigned'} • {task.department?.name || 'No department'}
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>{project.departments.length} departments</CardDescription>
              </CardHeader>
              <CardContent>
                {project.departments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No departments yet
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.departments.map((department) => (
                      <Card key={department.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{department.name}</CardTitle>
                          {department.head && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={department.head.avatar} />
                                <AvatarFallback>{department.head.name?.split(' ').map((n: string) => n[0]).join('') || 'H'}</AvatarFallback>
                              </Avatar>
                              {department.head.name}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm">
                            <span>{department._count.members} members</span>
                            <span>{department._count.tasks} tasks</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Milestones</CardTitle>
                <CardDescription>{project.milestones.length} milestones</CardDescription>
              </CardHeader>
              <CardContent>
                {project.milestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No milestones yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium">{milestone.title}</div>
                          <Badge variant={milestone.status === 'ACHIEVED' ? 'default' : 'secondary'}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Target: {new Date(milestone.targetDate).toLocaleDateString()}
                          {milestone.achievedAt && ` • Achieved: ${new Date(milestone.achievedAt).toLocaleDateString()}`}
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
    </div>
  )
}
