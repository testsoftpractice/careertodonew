'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  ArrowRight,
  FileText,
  BarChart3,
  PieChart,
  Filter,
  Download,
  X,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { VerificationGate } from '@/components/verification-gate'

export default function UniversityFundingPage() {
  const { user } = useAuth()
  useRoleAccess(['UNIVERSITY', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState('overview')
  const [fundingRequests, setFundingRequests] = useState<any[]>([])
  const [grants, setGrants] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalFunding: 0,
    activeRequests: 0,
    approvedGrants: 0,
    pendingDonations: 0,
  })

  const [loading, setLoading] = useState({
    requests: false,
    grants: false,
    donations: false,
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const fetchFundingRequests = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, requests: true }))
      const response = await fetch(`/api/dashboard/university/funding?universityId=${user.universityId || user.university?.id}`)
      const data = await response.json()

      if (data.success) {
        setFundingRequests(data.data?.fundingRequests || [])
        setStats(data.data?.stats || stats)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch funding data',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch funding error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch funding data',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, requests: false }))
    }
  }

  useEffect(() => {
    if (user) {
      fetchFundingRequests()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200'
      case 'DISBURSED': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getFundingTypeColor = (type: string) => {
    switch (type) {
      case 'GRANT': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'DONATION': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'SPONSORSHIP': return 'bg-teal-100 text-teal-700 border-teal-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredRequests = fundingRequests.filter((request: any) =>
    (filterStatus === 'ALL' || request.status === filterStatus) &&
    (request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <VerificationGate user={user} restrictActions={false} showBadge={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <header className="mb-6 sm:mb-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-indigo-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-lg">
                      <span>{user?.university?.name?.[0] || 'U'}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Funding Management
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {user?.university?.name || 'University'} • Manage funding opportunities
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/university">
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-indigo-100 text-xs sm:text-sm font-medium mb-1">Total Funding</p>
                    <p className="text-2xl sm:text-3xl font-bold">${stats.totalFunding.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 sm:h-10 text-indigo-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-amber-100 text-xs sm:text-sm font-medium mb-1">Active Requests</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.activeRequests}</p>
                  </div>
                  <FileText className="h-8 w-8 sm:h-10 text-amber-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Approved Grants</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.approvedGrants}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 sm:h-10 text-emerald-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Pending Donations</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.pendingDonations}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 sm:h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-indigo-200 dark:border-slate-800 rounded-2xl p-1 h-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="grants" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Grants</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Donations</span>
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl">Funding Overview</CardTitle>
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                      >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="DISBURSED">Disbursed</option>
                      </select>
                      <Button size="sm" onClick={fetchFundingRequests}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Request
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.requests ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading funding requests...</p>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm text-muted-foreground mb-4">No funding requests found</p>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Request
                      </Button>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request: any) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.title}</TableCell>
                              <TableCell>
                                <Badge className={getFundingTypeColor(request.type)}>
                                  {request.type}
                                </Badge>
                              </TableCell>
                              <TableCell>${request.amount?.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(request.submittedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/dashboard/university/funding/${request.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
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

            {/* GRANTS TAB */}
            <TabsContent value="grants">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Grant Applications</CardTitle>
                      <CardDescription>Track and manage grant applications</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Apply for Grant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.grants ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grants.map((grant: any) => (
                        <Card key={grant.id} className="border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold">{grant.title}</h4>
                              <Badge className={getStatusColor(grant.status)}>
                                {grant.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {grant.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">${grant.amount?.toLocaleString()}</span>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/university/grants/${grant.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* DONATIONS TAB */}
            <TabsContent value="donations">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Donations</CardTitle>
                      <CardDescription>Track donation requests and contributions</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.donations ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Donor</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donations.map((donation: any) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.donorName}</TableCell>
                              <TableCell>${donation.amount?.toLocaleString()}</TableCell>
                              <TableCell>{donation.purpose}</TableCell>
                              <TableCell>
                                {new Date(donation.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(donation.status)}>
                                  {donation.status}
                                </Badge>
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
          </Tabs>
        </div>
      </div>
    </VerificationGate>
  )
}
