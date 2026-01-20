'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Users,
  Target,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Settings,
  LogOut,
  LayoutDashboard,
  Briefcase,
  ArrowRight,
  BarChart3,
  Star,
  Wallet,
  PieChart,
  Sparkles,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { logoutAndRedirect } from '@/lib/utils/logout'

export default function InvestorDashboard() {
  const { user } = useAuth()

  useRoleAccess(['INVESTOR', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState('portfolio')

  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalEquity: 0,
    averageReturn: 0,
    portfolioCount: 0,
    opportunitiesCount: 0,
  })

  const [portfolio, setPortfolio] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])

  const [loading, setLoading] = useState({
    stats: false,
    portfolio: false,
    opportunities: false,
  })

  const fetchStats = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const response = await fetch(`/api/dashboard/investor/stats?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch statistics', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      toast({ title: 'Error', description: 'Failed to fetch statistics', variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const fetchPortfolio = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, portfolio: true }))
      const response = await fetch(`/api/investments?investorId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setPortfolio(data.data || [])
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch portfolio', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Fetch portfolio error:', error)
      toast({ title: 'Error', description: 'Failed to fetch portfolio', variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, portfolio: false }))
    }
  }

  const fetchOpportunities = async () => {
    if (!user) return
    try {
      setLoading(prev => ({ ...prev, opportunities: true }))
      const response = await fetch('/api/projects?seekingInvestment=true&status=ACTIVE')
      const data = await response.json()
      if (data.success) {
        setOpportunities(data.data || [])
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch opportunities', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Fetch opportunities error:', error)
      toast({ title: 'Error', description: 'Failed to fetch opportunities', variant: 'destructive' })
    } finally {
      setLoading(prev => ({ ...prev, opportunities: false }))
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  useEffect(() => {
    if (activeTab === 'portfolio') {
      fetchPortfolio()
    } else if (activeTab === 'opportunities') {
      fetchOpportunities()
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-emerald-500/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'I'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Investor Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Portfolio Management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/investor/profile">
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
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-emerald-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Opportunities</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Total Investments</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalInvestments}</p>
                    </div>
                    <Wallet className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Total Equity</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalEquity}%</p>
                    </div>
                    <PieChart className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-teal-100 text-xs sm:text-sm font-medium mb-1">Average Return</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.averageReturn}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-teal-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-amber-100 text-xs sm:text-sm font-medium mb-1">Portfolio Value</p>
                      <p className="text-3xl sm:text-4xl font-bold">${stats.portfolioCount.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                      Your Portfolio
                    </CardTitle>
                    <Link href="/dashboard/investor/portfolio">
                      <Button variant="ghost" size="sm" className="text-emerald-500">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.portfolio ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading portfolio...</p>
                    </div>
                  ) : portfolio.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">No investments yet</p>
                      <Link href="/marketplace">
                        <Button className="shadow-lg">
                          <Target className="h-4 w-4 mr-2" />
                          Browse Opportunities
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {portfolio.slice(0, 5).map((investment: any) => (
                        <div
                          key={investment.id}
                          className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">{investment.projectName}</h4>
                              <p className="text-xs text-muted-foreground">
                                Invested {new Date(investment.investedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={investment.status === 'ACTIVE' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {investment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                            <div>
                              <span className="text-muted-foreground">Amount</span>
                              <div className="font-semibold text-emerald-600">${investment.amount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Equity</span>
                              <div className="font-semibold">{investment.equitySplit}%</div>
                            </div>
                            <div className="hidden sm:block">
                              <span className="text-muted-foreground">Return</span>
                              <div className="font-semibold text-blue-600">
                                ${investment.projectedReturn?.toLocaleString() || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <Link href="/marketplace" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                  <Link href="/investor/discovery" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Users className="h-4 w-4 mr-2" />
                      Co-Founder Discovery
                    </Button>
                  </Link>
                  <Link href="/dashboard/investor/profile" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-white/10">
                      <Settings className="h-4 w-4 mr-2" />
                      Investment Preferences
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      Investment Opportunities
                    </CardTitle>
                    <CardDescription>Discover projects seeking investment</CardDescription>
                  </div>
                  <Link href="/marketplace">
                    <Button className="shadow-lg">
                      View Marketplace
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading.opportunities ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading opportunities...</p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Opportunities Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Check back soon for new investment opportunities
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {opportunities.slice(0, 6).map((opportunity: any) => (
                      <Link
                        key={opportunity.id}
                        href={`/marketplace/projects/${opportunity.id}/invest`}
                        className="group"
                      >
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge
                                variant={opportunity.status === 'ACTIVE' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {opportunity.status}
                              </Badge>
                              <Progress value={opportunity.completionRate || 0} className="w-20 h-2" />
                            </div>
                            <CardTitle className="text-base font-semibold line-clamp-2">
                              {opportunity.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {opportunity.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{opportunity.teamSize || 0}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="font-semibold text-emerald-600">
                                  ${opportunity.investmentGoal?.toLocaleString() || 'N/A'}
                                </span>
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

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <Link href="/investor/discovery" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-purple-500 transition-colors">Co-Founder Discovery</h3>
                        <p className="text-sm text-muted-foreground">Find promising founders</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/leaderboards" className="group">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Star className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">Leaderboards</h3>
                        <p className="text-sm text-muted-foreground">Top performers</p>
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
