'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeft,
  CheckCircle2,
  Clock,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function InvestorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('portfolio')

  // Data states (fetched from API)
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

  // Fetch stats from API
  useEffect(() => {
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

    fetchStats()
  }, [user])

  // Fetch portfolio from API
  useEffect(() => {
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
      } finally {
        setLoading(prev => ({ ...prev, portfolio: false }))
      }
    }

    if (activeTab === 'portfolio') {
      fetchPortfolio()
    }
  }, [activeTab, user])

  // Fetch opportunities from API
  useEffect(() => {
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
      } finally {
        setLoading(prev => ({ ...prev, opportunities: false }))
      }
    }

    if (activeTab === 'opportunities') {
      fetchOpportunities()
    }
  }, [activeTab, user])

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-background'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DollarSign className='h-6 w-6 text-green-500' />
              <h1 className='text-2xl font-bold'>Investor Dashboard</h1>
            </div>
            <div className='flex items-center gap-4'>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investor/profile">
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 mr-2 bg-green-500/20">
                    <AvatarFallback className="text-xs bg-green-500 text-white">
                      {user?.name?.charAt(0) || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investor/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href='/'>Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {activeTab === 'portfolio' && (
            <div className='grid gap-6 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Investment Overview</CardTitle>
                  <CardDescription>Your portfolio statistics and performance</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {loading.stats ? (
                    <div className='animate-pulse text-center py-8'>
                      <div className='h-6 w-6 border-4 border-t-green-500 border-r-transparent rounded-full animate-spin mx-auto' />
                      <p className='text-sm text-muted-foreground mt-2'>Loading metrics...</p>
                    </div>
                  ) : (
                    <>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <div className='text-3xl font-bold'>{stats.totalInvestments}</div>
                          <div className='text-sm text-muted-foreground'>Total Investments</div>
                        </div>
                        <div className='space-y-2'>
                          <div className='text-3xl font-bold text-green-500'>{stats.totalEquity}%</div>
                          <div className='text-sm text-muted-foreground'>Total Equity</div>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4 pt-4'>
                        <div className='space-y-2'>
                          <div className='text-3xl font-bold text-blue-500'>{stats.averageReturn}%</div>
                          <div className='text-sm text-muted-foreground'>Average Return</div>
                        </div>
                        <div className='space-y-2'>
                          <div className='text-3xl font-bold'>{stats.portfolioCount}</div>
                          <div className='text-sm text-muted-foreground'>Projects in Portfolio</div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>Track your investments and project performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.portfolio ? (
                    <div className='animate-pulse text-center py-8'>
                      <div className='h-12 w-12 border-4 border-t-green-500 border-r-transparent rounded-full animate-spin mx-auto' />
                      <p className='text-sm text-muted-foreground mt-2'>Loading portfolio...</p>
                    </div>
                  ) : portfolio.length > 0 ? (
                    <div className='space-y-4'>
                      {portfolio.slice(0, 10).map((investment) => (
                        <Card key={investment.id}>
                          <CardHeader>
                            <CardTitle>{investment.projectName}</CardTitle>
                            <CardDescription>Invested on {new Date(investment.investedAt).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                              <div className='space-y-2'>
                                <div className='text-sm text-muted-foreground'>Investment Type</div>
                                <Badge variant='outline'>{investment.investmentType}</Badge>
                              </div>
                              <div className='space-y-2'>
                                <div className='text-sm text-muted-foreground'>Amount</div>
                                <div className='text-3xl font-bold'>${investment.amount.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4 pt-4'>
                              <div className='space-y-2'>
                                <div className='text-sm text-muted-foreground'>Equity</div>
                                <div className='text-3xl font-bold'>{investment.equitySplit}%</div>
                              </div>
                              <div className='space-y-2'>
                                <div className='text-sm text-muted-foreground'>Projected Return</div>
                                <div className='text-3xl font-bold text-green-500'>{investment.projectedReturn ? investment.projectedReturn.toLocaleString() : 'N/A'}</div>
                              </div>
                            </div>
                            <div className='pt-3 border-t'>
                              <div className='text-sm text-muted-foreground'>Status</div>
                              <Badge variant={investment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {investment.status}
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant='outline' asChild>
                              <Link href={`/dashboard/investor/portfolio/${investment.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      <div className='text-center pt-4'>
                        <Button variant='outline' asChild>
                          <Link href='/api/investments'>
                            View All Investments
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className='p-12 text-center'>
                        <FileText className='h-20 w-20 mx-auto mb-4 text-muted-foreground' />
                        <h3 className='text-xl font-semibold mb-2'>No Investments Yet</h3>
                        <p className='text-muted-foreground mb-6'>
                          You haven't made any investments yet. Browse the marketplace to find
                          student-led projects seeking investment and funding opportunities.
                        </p>
                        <Button asChild>
                          <Link href='/marketplace'>
                            <Target className='h-4 w-4 mr-2' />
                            Browse Marketplace
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className='space-y-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-2xl font-bold'>Investment Opportunities</h2>
                  <p className='text-muted-foreground'>Discover projects seeking investment</p>
                </div>
              </div>

              {loading.opportunities ? (
                <div className='animate-pulse text-center py-12'>
                  <div className='h-12 w-12 border-4 border-t-green-500 border-r-transparent rounded-full animate-spin mx-auto' />
                  <p className='text-sm text-muted-foreground mt-2'>Loading opportunities...</p>
                </div>
              ) : opportunities.length > 0 ? (
                <div className='grid gap-6 lg:grid-cols-2'>
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id}>
                      <CardHeader>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <CardTitle>{opportunity.projectName}</CardTitle>
                            <CardDescription>{opportunity.projectDescription}</CardDescription>
                            <div className='flex items-center gap-2 mt-1'>
                              <Badge variant='outline'>{opportunity.category}</Badge>
                              <Badge variant='outline'>{opportunity.university}</Badge>
                            </div>
                          </div>
                          <div className='text-right'>
                            <span className='text-sm text-muted-foreground'>
                              {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                          <div className='text-sm text-muted-foreground'>Investment Goal</div>
                          <div className='text-3xl font-bold'>
                            ${opportunity.investmentGoal ? opportunity.investmentGoal.toLocaleString() : 'Not specified'}
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='text-sm text-muted-foreground'>Team Reputation</div>
                          <div className='flex items-center gap-2'>
                            <div className='flex-1'>
                              <Progress value={opportunity.teamReputation} max={5} className='h-2' />
                            </div>
                            <span className='text-sm font-semibold'>{opportunity.teamReputation.toFixed(1)}/5</span>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='text-sm text-muted-foreground'>Equity Split</div>
                          <div className='text-3xl font-bold'>{opportunity.equitySplit}%</div>
                        </div>
                      </CardContent>
                      <CardFooter className='pt-3 flex gap-2'>
                        <Button className='flex-1' variant='outline' asChild>
                          <Link href={`/projects/${opportunity.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button className='flex-1' asChild>
                          <Link href={`/marketplace/projects/${opportunity.id}/invest`}>
                            <DollarSign className='h-4 w-4 mr-2' />
                            Express Interest
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className='p-12 text-center'>
                    <Target className='h-20 w-20 mx-auto mb-4 text-muted-foreground' />
                    <h3 className='text-xl font-semibold mb-2'>No Opportunities Available</h3>
                    <p className='text-muted-foreground mb-6'>
                      Currently no projects are seeking investment. Check back later or
                      browse all projects to find investment opportunities.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className='text-center pt-8'>
                <Button variant='outline' asChild>
                  <Link href='/marketplace'>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to Marketplace
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Explore Marketplaces Section */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Marketplaces</CardTitle>
              <CardDescription>Access projects, jobs, suppliers, and needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4'>
                <Button variant='outline' className='h-auto flex-col gap-2 py-3 sm:py-4' asChild>
                  <Link href='/marketplace'>
                    <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6' />
                    <div className='text-center'>
                      <div className='font-semibold text-xs sm:text-sm'>Investment</div>
                      <div className='text-xs text-muted-foreground hidden sm:block'>Browse projects</div>
                    </div>
                  </Link>
                </Button>
                <Button variant='outline' className='h-auto flex-col gap-2 py-3 sm:py-4' asChild>
                  <Link href='/jobs'>
                    <Target className='h-5 w-5 sm:h-6 sm:w-6' />
                    <div className='text-center'>
                      <div className='font-semibold text-xs sm:text-sm'>Jobs</div>
                      <div className='text-xs text-muted-foreground hidden sm:block'>Find opportunities</div>
                    </div>
                  </Link>
                </Button>
                <Button variant='outline' className='h-auto flex-col gap-2 py-3 sm:py-4' asChild>
                  <Link href='/needs'>
                    <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
                    <div className='text-center'>
                      <div className='font-semibold text-xs sm:text-sm'>Needs</div>
                      <div className='text-xs text-muted-foreground hidden sm:block'>Project requests</div>
                    </div>
                  </Link>
                </Button>
                <Button variant='outline' className='h-auto flex-col gap-2 py-3 sm:py-4' asChild>
                  <Link href='/suppliers'>
                    <Users className='h-5 w-5 sm:h-6 sm:w-6' />
                    <div className='text-center'>
                      <div className='font-semibold text-xs sm:text-sm'>Suppliers</div>
                      <div className='text-xs text-muted-foreground hidden sm:block'>Find services</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='portfolio'>Portfolio</TabsTrigger>
                  <TabsTrigger value='opportunities'>Opportunities</TabsTrigger>
                </TabsList>
                <TabsContent value='portfolio' className='mt-4'>
                  <div className='text-center text-muted-foreground'>
                    Portfolio tab active
                  </div>
                </TabsContent>
                <TabsContent value='opportunities' className='mt-4'>
                  <div className='text-center text-muted-foreground'>
                    Opportunities tab active
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
