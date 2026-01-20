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
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'

export default function EmployerDashboard() {
  const { user } = useAuth()

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

  const [loading, setLoading] = useState({
    stats: false,
    requests: false,
  })

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await fetch(`/api/dashboard/employer/stats?userId=${user.id}`)
      const data = await response.json()

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
      const response = await fetch(`/api/verification?requesterId=${user.id}`)
      const data = await response.json()

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

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
    } else if (activeTab === 'requests') {
      fetchRequests()
    }
  }, [activeTab, user])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast({ title: 'Success', description: 'Logged out successfully' })
      window.location.href = '/auth'
    } catch (error) {
      console.error('Logout error:', error)
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-200 dark:border-slate-800 p-4 sm:p-6">
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
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowRight className="h-4 w-4" />
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
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-orange-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
          </TabsList>

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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/marketplace" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="h-5 w-5 sm:h-6 sm:w-6" />
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
                      <div className="bg-gradient-to-br from-orange-500 to-rose-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-orange-500 transition-colors">Jobs</h3>
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
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
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
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-blue-500 transition-colors">Suppliers</h3>
                        <p className="text-xs text-muted-foreground">Find services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      Verification Requests
                    </CardTitle>
                    <CardDescription>Manage student verification requests</CardDescription>
                  </div>
                  <Link href="/records/create">
                    <Button className="shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading.requests ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      You haven't submitted any verification requests yet.
                    </p>
                    <Link href="/records/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Request
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.slice(0, 10).map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                  {request.student?.name?.charAt(0) || 'S'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{request.student?.name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === 'APPROVED'
                                  ? 'default'
                                  : request.status === 'PENDING'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/records/${request.recordId}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
