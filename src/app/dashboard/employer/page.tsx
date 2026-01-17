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
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  ExternalLink,
  Plus,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Data states (fetched from API)
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

  // Fetch stats from API
  useEffect(() => {
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

    if (activeTab === 'overview') {
      fetchStats()
    }
  }, [activeTab, user])

  // Fetch verification requests from API
  useEffect(() => {
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
      } finally {
        setLoading(prev => ({ ...prev, requests: false }))
      }
    }

    if (activeTab === 'requests') {
      fetchRequests()
    }
  }, [activeTab, user])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Employer Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">{user?.name || 'Employer'}</span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowRight className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">Verification Requests</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardDescription className="text-xs sm:text-sm">Total Requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold break-words">{stats.totalRequests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardDescription className="text-xs sm:text-sm">Pending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-500 break-words">{stats.pendingRequests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardDescription className="text-xs sm:text-sm">Approved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-green-500 break-words">{stats.approvedRequests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardDescription className="text-xs sm:text-sm">Total Hires</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-500 break-words">{stats.totalHires}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Overview</CardTitle>
                    <CardDescription>Your verification request statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {loading.stats ? (
                      <div className="animate-pulse text-center py-6 sm:py-8">
                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-muted-foreground" />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">Loading metrics...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Approved Rate</span>
                            <span className="font-semibold">
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

                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rejected Rate</span>
                            <span className="font-semibold">
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
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common employer tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-sm" asChild>
                      <Link href="/dashboard/employer/verification-requests">
                        <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Browse Student Records</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm" asChild>
                      <Link href="/records/create">
                        <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Create Verification Request</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm" asChild>
                      <Link href="/jobs/create">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Post Job Listings</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm" asChild>
                      <Link href="/suppliers/create">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">List Your Business</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Explore Marketplaces</CardTitle>
                    <CardDescription>Access opportunities, suppliers, and more</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2">
                      <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                        <Link href="/marketplace">
                          <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                          <div className="text-center">
                            <div className="font-semibold text-xs sm:text-sm">Investment</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Browse projects</div>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                        <Link href="/needs">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
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
                      <Button variant="outline" className="h-auto flex-col gap-2 py-3 sm:py-4" asChild>
                        <Link href="/jobs">
                          <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                          <div className="text-center">
                            <div className="font-semibold text-xs sm:text-sm">Jobs</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Find candidates</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Verification Requests Tab */}
            <TabsContent value="requests" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Verification Requests</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Manage your verification requests</p>
                </div>
                <Button className="text-sm" asChild>
                  <Link href="/records/create">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Request</span>
                    <span className="sm:hidden">New</span>
                  </Link>
                </Button>
              </div>

              {loading.requests ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading requests...</p>
                </div>
              ) : requests.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead className="hidden md:table-cell">Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden lg:table-cell">Expires</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                  <AvatarImage src={request.subject?.avatar} />
                                  <AvatarFallback className="text-sm sm:text-base">
                                    {request.subject?.name?.charAt(0) || 'S'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm sm:text-base truncate">
                                    {request.subject?.name || 'Unknown'}
                                  </div>
                                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {request.subject?.email || ''}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm truncate max-w-[150px]">
                                {request.purpose || 'Background Check'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === 'APPROVED'
                                    ? 'default'
                                    : request.status === 'PENDING'
                                    ? 'secondary'
                                    : request.status === 'EXPIRED'
                                    ? 'outline'
                                    : 'destructive'
                                }
                                className="text-xs"
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="text-sm text-muted-foreground">
                                {request.expiresAt
                                  ? new Date(request.expiresAt).toLocaleDateString()
                                  : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {request.status === 'APPROVED' && (
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/records/${request.id}/view`}>
                                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      <span className="hidden sm:inline">View</span>
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 sm:p-12 text-center">
                    <FileText className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">No Verification Requests</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                      You haven't submitted any verification requests yet. Create a request to
                      verify student professional records.
                    </p>
                    <Button asChild>
                      <Link href="/records/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Verification Request
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
