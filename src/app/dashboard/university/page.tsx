'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  TrendingUp,
  Award,
  GraduationCap,
  Calendar,
  Shield,
  Star,
  Plus,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

interface DashboardStats {
  totalStudents: number
  totalProjects: number
  activeDepartments: number
  topStudents: any[]
}

export default function UniversityDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalProjects: 0,
    activeDepartments: 0,
    topStudents: [],
  })

  const [students, setStudents] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    students: false,
    projects: false,
  })

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      
      try {
        setLoading(prev => ({ ...prev, stats: true }))
        const response = await fetch(`/api/dashboard/university/stats?universityId=${user.universityId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setStats(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch statistics')
        }
      } catch (error) {
        console.error('Fetch stats error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch university statistics',
          variant: 'destructive',
        })
      } finally {
        setLoading(prev => ({ ...prev, stats: false }))
      }
    }

    if (activeTab === 'overview') {
      fetchStats()
    }
  }, [activeTab, user])

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return
      
      try {
        setLoading(prev => ({ ...prev, students: true }))
        const response = await fetch(`/api/users?universityId=${user.universityId}&role=STUDENT&limit=20`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setStudents(data.data.users || [])
        } else {
          throw new Error(data.error || 'Failed to fetch students')
        }
      } catch (error) {
        console.error('Fetch students error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch students',
          variant: 'destructive',
        })
      } finally {
        setLoading(prev => ({ ...prev, students: false }))
      }
    }

    if (activeTab === 'students') {
      fetchStudents()
    }
  }, [activeTab, user])

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return
      
      try {
        setLoading(prev => ({ ...prev, projects: true }))
        const response = await fetch(`/api/projects?universityId=${user.universityId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setProjects(data.data || [])
        } else {
          throw new Error(data.error || 'Failed to fetch projects')
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'destructive',
        })
      } finally {
        setLoading(prev => ({ ...prev, projects: false }))
      }
    }

    if (activeTab === 'projects') {
      fetchProjects()
    }
  }, [activeTab, user])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">University Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.university?.name || "University"}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Your university platform metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading.stats ? (
                    <div className="animate-pulse flex flex-col items-center justify-center py-8">
                      <div className="h-6 w-6 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading metrics...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">{stats.totalStudents}</div>
                          <div className="text-sm text-muted-foreground">Total Students</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">{stats.totalProjects}</div>
                          <div className="text-sm text-muted-foreground">Total Projects</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-blue-500">{stats.activeDepartments}</div>
                          <div className="text-sm text-muted-foreground">Active Departments</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-green-500">{stats.topStudents.length}</div>
                          <div className="text-sm text-muted-foreground">Top Ranked Students</div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common university management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/university/students">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Students
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/university/projects">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Manage Projects
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/leaderboards">
                        <Award className="h-4 w-4 mr-2" />
                        View Leaderboards
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/university/settings">
                        <Calendar className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Explore Marketplaces</CardTitle>
                  <CardDescription>Access projects, jobs, suppliers, and opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
                    <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                      <Link href="/marketplace">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                        <div className="text-center">
                          <div className="font-semibold text-xs sm:text-sm">Investment</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">Browse projects</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                      <Link href="/jobs">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                        <div className="text-center">
                          <div className="font-semibold text-xs sm:text-sm">Jobs</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">Career opportunities</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                      <Link href="/needs">
                        <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                        <div className="text-center">
                          <div className="font-semibold text-xs sm:text-sm">Needs</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">Project requests</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                      <Link href="/suppliers">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                        <div className="text-center">
                          <div className="font-semibold text-xs sm:text-sm">Suppliers</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">Find services</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest student and project activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">This week</div>
                      <div className="text-sm text-muted-foreground">
                        +{stats.totalStudents} new students joined
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">This week</div>
                      <div className="text-sm text-muted-foreground">
                        +{stats.totalProjects} new projects created
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">This week</div>
                      <div className="text-sm text-muted-foreground">
                        {stats.topStudents.length > 0 
                          ? (stats.topStudents.reduce((sum, s) => sum + (s.overallReputation || 0), 0) / stats.topStudents.length).toFixed(2)
                          : '0.00'} average reputation increase
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Student Directory</h2>
                  <p className="text-muted-foreground">Manage your university students</p>
                </div>
              </div>

              {loading.students ? (
                <div className="animate-pulse flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading students...</p>
                </div>
              ) : students.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {students.map((student) => (
                    <Card key={student.id}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                              {student.name?.charAt(0) || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle>{student.name}</CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{student.university?.name || ''}</Badge>
                              <Badge variant="outline">{student.major || ''}</Badge>
                              <Badge variant="outline">Class of {student.graduationYear || 'N/A'}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-2">Reputation</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Progress value={student.reputation || 0} max={5} className="h-2" />
                            </div>
                            <span className="font-semibold text-yellow-600">
                              {(student.reputation || 0).toFixed(1)}/5
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 pt-3">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Execution</div>
                            <div className="text-lg font-bold">
                              {(student.reputationScores?.execution || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Collaboration</div>
                            <div className="text-lg font-bold">
                              {(student.reputationScores?.collaboration || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Leadership</div>
                            <div className="text-lg font-bold">
                              {(student.reputationScores?.leadership || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Ethics</div>
                            <div className="text-lg font-bold">
                              {(student.reputationScores?.ethics || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Reliability</div>
                            <div className="text-lg font-bold">
                              {(student.reputationScores?.reliability || 0).toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm font-medium mb-2">Projects</div>
                          <div className="text-sm text-muted-foreground">
                            {student.projectCount || 0} projects joined
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="default" className="w-full">
                          View Full Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Students Found</h3>
                    <p className="text-muted-foreground mb-6">
                      No students are registered with your university yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">University Projects</h2>
                  <p className="text-muted-foreground">All projects associated with your university</p>
                </div>
                <Button asChild>
                  <Link href="/projects/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Link>
                </Button>
              </div>

              {loading.projects ? (
                <div className="animate-pulse flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
                </div>
              ) : projects.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge variant="outline">{project.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-2">Project Lead</div>
                          <div className="text-sm text-muted-foreground">
                            {project.lead?.name || 'Not assigned'}
                          </div>
                        </div>
                        <div className="text-sm font-medium mb-2">Team</div>
                        <div className="text-sm text-muted-foreground">
                          {project.teamSize || 1} team members
                        </div>
                        <div className="text-sm font-medium mb-2">Status</div>
                        <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <div className="text-sm font-medium mb-2">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress value={project.completion || 0} max={100} className="flex-1" />
                          <span className="text-sm">{project.completion || 0}%</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/projects/${project.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
                    <p className="text-muted-foreground mb-6">
                      No projects are associated with your university yet.
                      Create projects for your students to collaborate and demonstrate their skills.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="text-center text-muted-foreground">
                  Click on a tab to view more details
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
