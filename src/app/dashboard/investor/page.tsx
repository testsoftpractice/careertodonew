'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Wallet, TrendingUp, DollarSign, ArrowRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { VerificationGate } from '@/components/verification-gate'

export default function InvestorDashboard() {
  const { user } = useAuth()
  const hasAccess = useRoleAccess(['INVESTOR', 'PLATFORM_ADMIN'])

  const [activeTab, setActiveTab] = useState<'portfolio' | 'opportunities'>('portfolio')
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
          description: 'Failed to fetch opportunities',
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

  useEffect(() => {
    if (user) {
      fetchStats()
      if (activeTab === 'portfolio') {
        fetchPortfolio()
      } else if (activeTab === 'opportunities') {
        fetchOpportunities()
      }
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
      // Redirect would happen via middleware
    } else {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      })
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center">
            <p className="text-muted-foreground">Access Denied</p>
            <p className="text-sm mt-2">You don't have permission to view this page</p>
            <p className="text-xs text-muted-foreground mt-4">Only verified investors can access this dashboard</p>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 sm:h-14 shadow-lg ring-2 ring-indigo-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-lg">
                    <span>{user?.name?.[0] || 'I'}</span>
                  </AvatarFallback>
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
                  <div className="flex items-center gap-2">
                    <Link href="/">
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      Home
                      </Button>
                    <Link>
                    <Button onClick={handleLogout} variant="ghost" size="sm">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border-indigo-200 dark:border-slate-800 p-1 h-auto">
            <TabsList className="bg-white/50 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-indigo-200 dark:border-indigo-800 p-1 h-auto">
              <TabsTrigger value="portfolio" onClick={() => setActiveTab('portfolio')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="opportunities" onClick={() => setActiveTab('opportunities')} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-white rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 transition-all duration-300">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                <span className="hidden sm:inline">Opportunities</span>
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab Content */}
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
                  <Button variant="outline" size="sm" onClick={() => window.open('https://marketplace', '_blank')}>
                    Browse Opportunities
                  </Button>
                </div>
              ) : (
                <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {portfolio.map((investment: any) => (
                    <Card key={investment.id} className="bg-white dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div>
                              <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">Total Invested</p>
                              <p className="text-3xl sm:text-4xl font-bold">${stats.totalInvested.toLocaleString()}</p>
                            </div>
                            <Wallet className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-200" />
                          </div>
                          <div className="flex items-center justify-center">
                            <Badge variant={investment.status === 'ACTIVE' ? 'default' : 'outline'} className="text-xs">
                              {investment.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Opportunities Tab Content */}
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
                <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {opportunities.map((project: any) => (
                    <div key={project.id} className="p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-200 transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:shadow-2xl hover:shadow-2xl hover:translate-y-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-base mb-1">{project.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        </div>
                        <Badge variant={project.status === 'IN_PROGRESS' ? 'default' : 'outline'} className="text-xs">
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
          </Tabs>
        </div>
      </div>
    )
  )
}
