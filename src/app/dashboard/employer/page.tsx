'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  ExternalLink,
  Plus,
  LogOut,
  LayoutDashboard,
  Search,
  Clock,
  Settings,
  Target,
  UserCheck,
  Sparkles,
  ChevronRight,
  Building2,
  Edit3,
  Save,
  UserPlus,
  MoreVertical,
  Filter,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Star,
  X,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { logoutAndRedirect } from '@/lib/utils/logout'
import { VerificationGate } from '@/components/verification-gate'
import { authFetch } from '@/lib/api-response'

function DashboardContent({ user }: { user: any }) {
  useRoleAccess(['EMPLOYER', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalHires: 0,
    averageRating: 0,
  })

  const [requests, setRequests] = useState<any[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [pipeline, setPipeline] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    requests: false,
    candidates: false,
    pipeline: false,
    jobs: false,
    team: false,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await authFetch(`/api/dashboard/employer/stats?userId=${user.id}`)

      if (!response.ok) {
        console.error('Fetch stats error: Response not ok', response.status)
        return
      }

      const text = await response.text()

      if (!text || text.trim() === '') {
        console.error('Fetch stats error: Empty response')
        return
      }

      const data = JSON.parse(text)

      if (data.success) {
        setStats(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch statistics',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const fetchRequests = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, requests: true }))
      const response = await authFetch(`/api/verification-requests?requesterId=${user.id}`)

      if (!response.ok) {
        console.error('Fetch requests error: Response not ok', response.status)
        return
      }

      const text = await response.text()

      if (!text || text.trim() === '') {
        console.error('Fetch requests error: Empty response')
        return
      }

      const data = JSON.parse(text)

      if (data.success) {
        setRequests(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch verification requests',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch requests error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch verification requests',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, requests: false }))
    }
  }

  const fetchCandidates = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, candidates: true }))
      const response = await authFetch(`/api/dashboard/employer/candidates?employerId=${user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }

      const data = await response.json()

      if (data.success) {
        // Extract candidates array from nested response
        setCandidates(data.data?.candidates || [])
      }
    } catch (error) {
      console.error('Fetch candidates error:', error)
      setCandidates([]) // Reset to empty array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch candidates',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, candidates: false }))
    }
  }

  const fetchPipeline = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, pipeline: true }))
      const response = await authFetch(`/api/dashboard/employer/pipeline?employerId=${user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch pipeline')
      }

      const data = await response.json()

      if (data.success) {
        // API now returns pipeline data directly as an array
        setPipeline(Array.isArray(data.data) ? data.data : [])
      }
    } catch (error) {
      console.error('Fetch pipeline error:', error)
      setPipeline([]) // Reset to empty array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch pipeline',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, pipeline: false }))
    }
  }

  const fetchJobs = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, jobs: true }))
      const response = await authFetch(`/api/jobs?userId=${user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()

      if (data.success) {
        // Extract jobs array from nested response
        setJobs(Array.isArray(data.data) ? data.data : data.data?.jobs || [])
      }
    } catch (error) {
      console.error('Fetch jobs error:', error)
      setJobs([]) // Reset to empty array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }))
    }
  }

  const fetchTeam = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, team: true }))
      const response = await authFetch(`/api/dashboard/employer/team?employerId=${user.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch team')
      }

      const data = await response.json()

      if (data.success) {
        // Handle both array and object response formats
        const teamData = Array.isArray(data.data) ? data.data : data.data?.members || []
        setTeam(teamData)
      }
    } catch (error) {
      console.error('Fetch team error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch team',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, team: false }))
    }
  }

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
    } else if (activeTab === 'requests') {
      fetchRequests()
    } else if (activeTab === 'candidates') {
      fetchCandidates()
    } else if (activeTab === 'pipeline') {
      fetchPipeline()
    } else if (activeTab === 'jobs') {
      fetchJobs()
    } else if (activeTab === 'team') {
      fetchTeam()
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

  const filteredCandidates = (candidates || []).filter(candidate =>
    candidate.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredJobs = (jobs || []).filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'REVIEWED': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'INTERVIEWING': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'OFFERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'HIRED': return 'bg-green-100 text-green-700 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200'
      case 'FILLED': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="sticky top-0 z-50 mb-6 sm:mb-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-orange-500/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-rose-500 text-white font-bold text-lg">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'E'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    Employer Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {user?.name || 'Employer'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard/employer/profile">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-orange-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Pipeline</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm font-medium mb-1">Total Requests</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalRequests}</p>
                    </div>
                    <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-amber-100 text-xs sm:text-sm font-medium mb-1">Pending</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.pendingRequests}</p>
                    </div>
                    <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-amber-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Approved</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.approvedRequests}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Total Hires</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalHires}</p>
                    </div>
                    <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                      Verification Overview
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.stats ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading metrics...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Approval Rate</span>
                          <span className="font-semibold text-emerald-600">
                            {stats.totalRequests > 0
                              ? Math.round((stats.approvedRequests / stats.totalRequests) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress
                          value={stats.totalRequests > 0 ? (stats.approvedRequests / stats.totalRequests) * 100 : 0}
                          className="h-2 sm:h-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rejected Rate</span>
                          <span className="font-semibold text-red-600">
                            {stats.totalRequests > 0
                              ? Math.round((stats.rejectedRequests / stats.totalRequests) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress
                          value={stats.totalRequests > 0 ? (stats.rejectedRequests / stats.totalRequests) * 100 : 0}
                          className="h-2 sm:h-3"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/records/create" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Verification Request
                    </Button>
                  </Link>
                  <Link href="/jobs/create" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Post Job Listing
                    </Button>
                  </Link>
                  <Link href="/suppliers/create" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Building2 className="h-4 w-4 mr-2" />
                      List Your Business
                    </Button>
                  </Link>
                  <Link href="/marketplace" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Target className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CANDIDATES TAB */}
          <TabsContent value="candidates" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Candidates</CardTitle>
                    <CardDescription>Manage and track job applicants</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                      />
                    </div>
                    <Button size="sm" onClick={fetchCandidates}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading.candidates ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading candidates...</p>
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-muted-foreground mb-4">No candidates found</p>
                    <Link href="/jobs/create">
                      <Button size="sm">Create a Job Posting</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Applied Position</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidates.map((candidate: any) => (
                          <TableRow key={candidate.id}>
                            <TableCell className="font-medium">{candidate.candidate?.name}</TableCell>
                            <TableCell>{candidate.candidate?.email}</TableCell>
                            <TableCell>{candidate.job?.title}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(candidate.status)}>
                                {candidate.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(candidate.appliedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/candidates/${candidate.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PIPELINE TAB */}
          <TabsContent value="pipeline" className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-5 gap-4">
              {['APPLIED', 'REVIEWED', 'INTERVIEWING', 'OFFERED', 'HIRED'].map((stage: string) => (
                <Card key={stage} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold capitalize">{stage}</CardTitle>
                      <Badge variant="outline">{(pipeline || []).filter((p: any) => p.status === stage).length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                    {loading.pipeline ? (
                      <div className="text-center py-4">
                        <div className="h-6 w-6 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      <>
                        {(pipeline || []).filter((p: any) => p.status === stage).map((candidate: any) => (
                          <Card key={candidate.id} className="p-3 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={candidate.candidate?.avatar} />
                                <AvatarFallback className="bg-primary text-white text-xs">
                                  {candidate.candidate?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{candidate.candidate?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{candidate.job?.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(candidate.appliedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* JOBS TAB */}
          <TabsContent value="jobs" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Job Postings</CardTitle>
                    <CardDescription>Manage your job listings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="CLOSED">Closed</option>
                      <option value="FILLED">Filled</option>
                    </select>
                    <Link href="/jobs/create">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading.jobs ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading jobs...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-muted-foreground mb-4">No job postings found</p>
                    <Link href="/jobs/create">
                      <Button size="sm">Create Your First Job Posting</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Posted Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs
                          .filter((job: any) => filterStatus === 'ALL' || job.status === filterStatus)
                          .map((job: any) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{job.applicationCount || 0}</TableCell>
                              <TableCell>
                                <Badge className={getJobStatusColor(job.status)}>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(job.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/jobs/${job.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/jobs/${job.id}/edit`}>
                                      <Edit3 className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-4 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Team Members</CardTitle>
                      <CardDescription>Manage your team and roles</CardDescription>
                    </div>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.team ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading team...</p>
                    </div>
                  ) : team.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm text-muted-foreground mb-4">No team members yet</p>
                      <Button size="sm">Add First Team Member</Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {team.map((member: any) => (
                        <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-primary text-white">
                              {member.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'T'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <Badge variant="outline" className="mt-1">{member.role}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* REQUESTS TAB */}
          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Verification Requests</CardTitle>
                <CardDescription>Track your university verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.requests ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-muted-foreground mb-4">No verification requests</p>
                    <Link href="/records/create">
                      <Button size="sm">Create Verification Request</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {requests.map((request: any) => (
                      <div key={request.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{request.type}</h4>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Submitted: {new Date(request.submittedAt).toLocaleString()}
                            </p>
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
      </div>
    </div>
  )
}

export default function EmployerDashboard() {
  const { user } = useAuth()
  return (
    <VerificationGate user={user} restrictActions={true} showBadge={true}>
      <DashboardContent user={user} />
    </VerificationGate>
  )
}
