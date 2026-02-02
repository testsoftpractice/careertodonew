'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  TrendingUp,
  Award,
  GraduationCap,
  Calendar,
  Shield,
  Star,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Building2,
  Target,
  Briefcase,
  BarChart3,
  Settings,
  Bell,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { logoutAndRedirect } from '@/lib/utils/logout'

interface DashboardStats {
  totalStudents: number
  totalProjects: number
  activeDepartments: number
  topStudents: any[]
}

export default function UniversityDashboard() {
  const { user } = useAuth()
  useRoleAccess(['UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'])

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

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await fetch(`/api/dashboard/university/stats?universityId=${user.university?.id || user.universityId}`)

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

  const fetchStudents = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, students: true }))
      const response = await fetch(`/api/dashboard/university/students?limit=20`)

      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }

      const data = await response.json()

      if (data.success) {
        setStudents(data.data.students || [])
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

  const fetchProjects = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, projects: true }))
      const response = await fetch(`/api/dashboard/university/projects`)

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

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
    } else if (activeTab === 'students') {
      fetchStudents()
    } else if (activeTab === 'projects') {
      fetchProjects()
    }
  }, [activeTab, user])

  const handleLogout = async () => {
    const success = await logoutAndRedirect()

    if (success) {
      toast({ title: 'Success', description: 'Logged out successfully' })
    } else {
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-indigo-500/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-lg">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {user?.university?.name || 'University'} Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {user?.role} • Admin Console
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/university/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-indigo-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Departments</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-indigo-100 text-xs sm:text-sm font-medium mb-1">Total Students</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Active Projects</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalProjects}</p>
                    </div>
                    <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Departments</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.activeDepartments}</p>
                    </div>
                    <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-amber-100 text-xs sm:text-sm font-medium mb-1">Top Students</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.topStudents.length}</p>
                    </div>
                    <Award className="h-8 w-8 sm:h-10 sm:w-10 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                      Recent Activity
                    </CardTitle>
                    <Link href="/dashboard/university/activity">
                      <Button variant="ghost" size="sm" className="text-indigo-500">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                      <GraduationCap className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">New Students</div>
                        <div className="text-xs text-muted-foreground">This week</div>
                      </div>
                      <div className="text-lg font-bold text-indigo-600">+{stats.totalStudents}</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <Briefcase className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">New Projects</div>
                        <div className="text-xs text-muted-foreground">This week</div>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">+{stats.totalProjects}</div>
                    </div>
                    {stats.topStudents.length > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                        <Star className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Avg Reputation</div>
                          <div className="text-xs text-muted-foreground">Top students</div>
                        </div>
                        <div className="text-lg font-bold text-amber-600">
                          {(stats.topStudents.reduce((sum: any, s: any) => sum + (s.overallReputation || 0), 0) / stats.topStudents.length).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/university/students" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Students
                    </Button>
                  </Link>
                  <Link href="/dashboard/university/projects" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Manage Projects
                    </Button>
                  </Link>
                  <Link href="/dashboard/university/departments" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Building2 className="h-4 w-4 mr-2" />
                      Departments
                    </Button>
                  </Link>
                  <Link href="/leaderboards" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Award className="h-4 w-4 mr-2" />
                      Leaderboards
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/marketplace" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-indigo-500 transition-colors">Marketplace</h3>
                        <p className="text-xs text-muted-foreground">Projects & investments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/jobs" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-blue-500 transition-colors">Jobs</h3>
                        <p className="text-xs text-muted-foreground">Career opportunities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/needs" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-emerald-500 transition-colors">Needs</h3>
                        <p className="text-xs text-muted-foreground">Project requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/suppliers" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-amber-500 transition-colors">Suppliers</h3>
                        <p className="text-xs text-muted-foreground">Find services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      Student Directory
                    </CardTitle>
                    <CardDescription>Manage your university students</CardDescription>
                  </div>
                  <Link href="/dashboard/university/students">
                    <Button className="shadow-lg">
                      View All Students
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading.students ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Students Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Students haven't joined your university yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.slice(0, 9).map((student: any) => (
                      <Card key={student.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg">
                                {student.name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base truncate">{student.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant={student.status === 'ACTIVE' ? 'default' : 'outline'} className="text-xs">
                              {student.status || 'Active'}
                            </Badge>
                            {student.overallReputation && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" />
                                <span>{student.overallReputation.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                      University Projects
                    </CardTitle>
                    <CardDescription>Track and manage student projects</CardDescription>
                  </div>
                  <Link href="/dashboard/university/projects">
                    <Button className="shadow-lg">
                      View All Projects
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading.projects ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Students haven't created any projects yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.slice(0, 6).map((project: any) => (
                      <Link key={project.id} href={`/projects/${project.id}`} className="group">
                        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge
                                variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {project.status}
                              </Badge>
                              <Progress value={project.completionRate || 0} className="w-20 h-2" />
                            </div>
                            <CardTitle className="text-base font-semibold line-clamp-2">
                              {project.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{project.teamSize || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3.5 w-3.5" />
                                <span>{project.completionRate || 0}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                  Departments
                </CardTitle>
                <CardDescription>Manage university departments and programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/university/departments" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Departments
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/dashboard/university/approvals" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Project Approvals
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/dashboard/university/performance" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Performance Analytics
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <Link href="/leaderboards" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-pink-500 transition-colors">Leaderboards</h3>
                        <p className="text-sm text-muted-foreground">Top students and projects</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/university/performance" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-purple-500 transition-colors">Performance</h3>
                        <p className="text-sm text-muted-foreground">University analytics</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
