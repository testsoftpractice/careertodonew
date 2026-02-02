'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Wallet, TrendingUp, DollarSign, ArrowRight, LogOut } from 'lucide-react'
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
    totalInvested: 0,
    totalEquity: 0,
    avgReturn: 0,
    portfolioValue: 0,
    totalOpportunities: 0,
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
      const response = await fetch('/api/dashboard/investor/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          totalInvested: data.data.totalInvested || 0,
          totalEquity: data.data.totalEquity || 0,
          avgReturn: data.data.avgReturn || 0,
          portfolioValue: data.data.totalInvested || 0,
          totalOpportunities: data.data.totalOpportunities || 0,
        })
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
          description: 'Failed to fetch portfolio',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch portfolio error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolio',
        variant: 'destructive'
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
          description: 'Failed to fetch opportunities',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch opportunities error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch opportunities',
        variant: 'destructive'
      })
    } finally {
      setLoading(prev => ({ ...prev, opportunities: false }))
    }
  }

  const handleLogout = async () => {
    const success = await logoutAndRedirect()
    if (success) {
      toast({ title: 'Success', description: 'Logged out successfully' })
    } else {
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-emerald-500/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'I'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Investor Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {user?.role || 'Investor'} • Portfolio Management
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
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-emerald-200 dark:border-slate-800 rounded-2xl p-1 h-auto flex-wrap gap-1 sm:gap-2">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Opportunities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Total Invested</p>
                      <p className="text-3xl sm:text-4xl font-bold">${stats.totalInvested.toLocaleString()}</p>
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
                    <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-teal-100 text-xs sm:text-sm font-medium mb-1">Average Return</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.avgReturn}%</p>
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
                      <p className="text-3xl sm:text-4xl font-bold">${stats.portfolioValue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">Your Portfolio</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading.portfolio ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading portfolio...</p>
                  </div>
                ) : portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-muted-foreground mb-4">No investments yet</p>
                    <Link href="/marketplace">
                      <Button className="shadow-lg">
                        Browse Opportunities
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {portfolio.map((investment: any) => {
                      const invested = parseFloat(investment.amount || 0)
                      const currentValue = parseFloat(investment.currentValue || 0)
                      const equity = parseFloat(investment.equity || 0)
                      const roi = currentValue > 0 ? ((currentValue - invested) / invested) * 100 : 0

                      return (
                        <div
                          key={investment.id}
                          className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-200 transition-all duration-200 border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge variant={investment.status === 'ACTIVE' ? 'default' : 'outline'} className="text-xs">
                                {investment.status || 'PENDING'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(investment.investedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold">
                                ${invested.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-base mb-1">{investment.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                              Investment in {investment.project?.name || 'project'}
                            </p>
                            <div className="flex items-start justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {equity}% equity
                              </span>
                              <Badge variant={roi > 20 ? 'default' : roi > 0 ? 'default' : 'outline'} className="text-xs">
                                {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">
                                ${currentValue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Total Opportunities</p>
                      <p className="text-3xl sm:text-4xl font-bold">{stats.totalOpportunities}</p>
                    </div>
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">Investment Opportunities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading.opportunities ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading opportunities...</p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-muted-foreground mb-4">No opportunities available at this time</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {opportunities.map((project: any) => (
                      <div
                        key={project.id}
                        className="p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-200 transition-all duration-200 border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base mb-1">{project.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <Badge variant={project.seekingInvestment ? 'default' : 'outline'} className="text-xs">
                            {project.seekingInvestment ? 'Seeking Investment' : 'Self-funded'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {project.category || 'General'}
                          </span>
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
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
