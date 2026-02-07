'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowRight,
  LogOut,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { VerificationGate } from '@/components/verification-gate'

export default function InvestorDashboard() {
  const { user } = useAuth()
  useRoleAccess(['INVESTOR', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'opportunities' | 'deals' | 'financial' | 'startups'>('overview')
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalEquity: 0,
    avgReturn: 0,
    portfolioValue: 0,
    totalOpportunities: 0,
    activeDeals: 0,
  })
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [financial, setFinancial] = useState<any>({})
  const [startups, setStartups] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    portfolio: false,
    opportunities: false,
    deals: false,
    financial: false,
    startups: false,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('ALL')

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await fetch('/api/dashboard/investor/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          totalInvested: data.data.totalInvested || 0,
          totalEquity: data.data.totalEquity || 0,
          avgReturn: data.data.avgReturn || 0,
          portfolioValue: data.data.totalInvested || 0,
          totalOpportunities: data.data.totalOpportunities || 0,
          activeDeals: data.data.activeDeals || 0,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch statistics',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const fetchPortfolio = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, portfolio: true }))
      const response = await fetch('/api/dashboard/investor/portfolio')
      const data = await response.json()

      if (data.success) {
        setPortfolio(data.data?.investments || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch portfolio',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch portfolio error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolio',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, portfolio: false }))
    }
  }

  const fetchOpportunities = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, opportunities: true }))
      const response = await fetch('/api/projects?status=IN_PROGRESS')
      const data = await response.json()

      if (data.success) {
        setOpportunities(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch opportunities',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch opportunities error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch opportunities',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, opportunities: false }))
    }
  }

  const fetchDeals = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, deals: true }))
      const response = await fetch('/api/investments/deals')
      const data = await response.json()

      if (data.success) {
        setDeals(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch deals',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch deals error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch deals',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, deals: false }))
    }
  }

  const fetchFinancial = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, financial: true }))
      const response = await fetch('/api/dashboard/investor/financial')
      const data = await response.json()

      if (data.success) {
        setFinancial(data.data || {})
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch financial data',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch financial error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch financial data',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, financial: false }))
    }
  }

  const fetchStartups = async () => {
    if (!user) return

    try {
      setLoading(prev => ({ ...prev, startups: true }))
      const response = await fetch('/api/dashboard/investor/startups')
      const data = await response.json()

      if (data.success) {
        setStartups(data.data || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch startups',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch startups error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch startups',
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => ({ ...prev, startups: false }))
    }
  }

  useEffect(() => {
    if (user) {
      fetchStats()
      if (activeTab === 'portfolio') {
        fetchPortfolio()
      } else if (activeTab === 'opportunities') {
        fetchOpportunities()
      } else if (activeTab === 'deals') {
        fetchDeals()
      } else if (activeTab === 'financial') {
        fetchFinancial()
      } else if (activeTab === 'startups') {
        fetchStartups()
      }
    }
  }, [user, activeTab])

  const handleLogout = async () => {
    const success = await fetch('/api/auth/logout')
    if (success) {
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      })
    }
  }

  const getDealStatusColor = (status: string) => {
    switch (status) {
      case 'PROPOSED': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'NEGOTIATING': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'AGREED': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'FUNDED': return 'bg-green-100 text-green-700 border-green-200'
      case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getInvestmentTypeColor = (type: string) => {
    switch (type) {
      case 'EQUITY': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'DEBT': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CONVERTIBLE': return 'bg-teal-100 text-teal-700 border-teal-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <VerificationGate user={user} restrictActions={false} showBadge={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <header className="mb-6 sm:mb-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-indigo-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-lg">
                      <span>{user?.name?.[0] || 'I'}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Investor Dashboard
                      </h1>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {user?.role || 'Investor'} • Portfolio Management
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/dashboard/investor/profile">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border-indigo-200 dark:border-indigo-800 p-1 h-auto">
            <TabsList className="bg-white/50 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-indigo-200 dark:border-indigo-800 p-1 h-auto flex-wrap gap-1 sm:gap-2">
              <TabsTrigger value="overview" onClick={() => setActiveTab('overview')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" onClick={() => setActiveTab('portfolio')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="opportunities" onClick={() => setActiveTab('opportunities')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Opportunities</span>
              </TabsTrigger>
              <TabsTrigger value="deals" onClick={() => setActiveTab('deals')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Deals</span>
              </TabsTrigger>
              <TabsTrigger value="financial" onClick={() => setActiveTab('financial')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Financial</span>
              </TabsTrigger>
              <TabsTrigger value="startups" onClick={() => setActiveTab('startups')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Startups</span>
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Total Invested</p>
                        <p className="text-3xl sm:text-4xl font-bold">${stats.totalInvested.toLocaleString()}</p>
                      </div>
                      <Wallet className="h-10 w-10 text-indigo-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium mb-1">Total Equity</p>
                        <p className="text-3xl sm:text-4xl font-bold">{stats.totalEquity.toFixed(1)}%</p>
                      </div>
                      <Users className="h-10 w-10 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium mb-1">Avg Return</p>
                        <p className="text-3xl sm:text-4xl font-bold">{stats.avgReturn.toFixed(1)}%</p>
                      </div>
                      <TrendingUp className="h-10 w-10 text-emerald-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-amber-100 text-sm font-medium mb-1">Active Deals</p>
                        <p className="text-3xl sm:text-4xl font-bold">{stats.activeDeals}</p>
                      </div>
                      <Sparkles className="h-10 w-10 text-amber-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/marketplace" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Browse Marketplace
                      </Button>
                    </Link>
                    <Link href="/dashboard/investor/portfolio">
                      <Button variant="outline" className="w-full justify-start">
                        <Wallet className="h-4 w-4 mr-2" />
                        View Portfolio
                      </Button>
                    </Link>
                    <Link href="/dashboard/investor/deals">
                      <Button variant="outline" className="w-full justify-start">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Manage Deals
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* PORTFOLIO TAB */}
            <TabsContent value="portfolio">
              {loading.portfolio ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading portfolio...</p>
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm text-muted-foreground mb-4">No investments yet</p>
                  <Link href="/marketplace">
                    <Button>Browse Opportunities</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((investment: any) => (
                    <Card key={investment.id} className="bg-white dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge className={getInvestmentTypeColor(investment.type)}>
                              {investment.type}
                            </Badge>
                            <p className="text-2xl font-bold mt-2">${investment.amount.toLocaleString()}</p>
                          </div>
                          <Badge variant={investment.status === 'ACTIVE' ? 'default' : 'outline'}>
                            {investment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {investment.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground">
                            {new Date(investment.investedAt).toLocaleDateString()}
                          </span>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/investor/portfolio/${investment.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* OPPORTUNITIES TAB */}
            <TabsContent value="opportunities">
              {loading.opportunities ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading opportunities...</p>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm text-muted-foreground mb-4">No opportunities available</p>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/projects'}>
                    Browse Projects
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {opportunities.map((project: any) => (
                    <div key={project.id} className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-200 transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:shadow-2xl hover:translate-y-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-base mb-1">{project.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <Badge variant={project.status === 'IN_PROGRESS' ? 'default' : 'outline'}>
                          {project.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.location.href = `/projects/${project.id}`}>
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* DEALS TAB */}
            <TabsContent value="deals">
              <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Deals</CardTitle>
                      <CardDescription>Manage your investment deals</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={filterStage}
                        onChange={(e) => setFilterStage(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                      >
                        <option value="ALL">All Stages</option>
                        <option value="PROPOSED">Proposed</option>
                        <option value="NEGOTIATING">Negotiating</option>
                        <option value="AGREED">Agreed</option>
                        <option value="FUNDED">Funded</option>
                      </select>
                      <Button size="sm" onClick={fetchDeals}>
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.deals ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading deals...</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {deals
                        .filter((deal: any) => filterStage === 'ALL' || deal.status === filterStage)
                        .map((deal: any) => (
                          <Card key={deal.id} className="p-4 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{deal.project?.name || 'Unknown Project'}</h4>
                                  <Badge className={getDealStatusColor(deal.status)}>
                                    {deal.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    ${deal.amount.toLocaleString()}
                                  </span>
                                  {deal.equity && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                      {deal.equity}% equity
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Last updated: {new Date(deal.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/investor/deals/${deal.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* FINANCIAL ANALYTICS TAB */}
            <TabsContent value="financial">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Investment by Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.financial ? (
                      <div className="text-center py-8">
                        <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Equity Investments</span>
                            <span className="font-semibold">${financial.equityInvestments?.toLocaleString() || '0'}</span>
                          </div>
                          <Progress value={financial.equityPercentage || 0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Debt Investments</span>
                            <span className="font-semibold">${financial.debtInvestments?.toLocaleString() || '0'}</span>
                          </div>
                          <Progress value={financial.debtPercentage || 0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Convertible Notes</span>
                            <span className="font-semibold">${financial.convertibleNotes?.toLocaleString() || '0'}</span>
                          </div>
                          <Progress value={financial.convertiblePercentage || 0} className="h-2" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Returns & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.financial ? (
                      <div className="text-center py-8">
                        <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Returns</p>
                          <p className="text-2xl font-bold text-emerald-600">${financial.totalReturns?.toLocaleString() || '$0'}</p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Average ROI</p>
                          <p className="text-2xl font-bold text-blue-600">{financial.averageROI?.toFixed(1) || '0'}%</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Best Performing Investment</p>
                          <p className="text-lg font-semibold text-purple-600">{financial.bestInvestment || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{financial.bestROI?.toFixed(1) || '0'}% ROI</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800 mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.financial ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {(financial.recentActivity || []).map((activity: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'investment' ? 'bg-emerald-100 text-emerald-600' :
                            activity.type === 'return' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'investment' && <DollarSign className="h-4 w-4" />}
                            {activity.type === 'return' && <TrendingUp className="h-4 w-4" />}
                            {activity.type === 'deal' && <Sparkles className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline">{activity.amount}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* STARTUPS DISCOVERY TAB */}
            <TabsContent value="startups">
              <Card className="bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Startup Discovery</CardTitle>
                      <CardDescription>Browse and discover startups seeking investment</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search startups..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                        />
                      </div>
                      <select
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                      >
                        <option>All Sectors</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Fintech</option>
                        <option>E-commerce</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.startups ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading startups...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                      {startups.map((startup: any) => (
                        <Card key={startup.id} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg mb-2">{startup.name}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {startup.description}
                                </p>
                              </div>
                              <Badge variant="outline">{startup.sector}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Funding Goal</span>
                                <span className="font-semibold">${startup.fundingGoal?.toLocaleString() || 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Raised</span>
                                <span className="font-semibold text-emerald-600">${startup.raised?.toLocaleString() || '$0'}</span>
                              </div>
                              <Progress
                                value={startup.raisedPercentage || 0}
                                className="h-2"
                              />
                            </div>
                            <Button className="w-full" variant="outline" asChild>
                              <Link href={`/startups/${startup.id}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
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
