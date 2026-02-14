'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Target,
  Briefcase,
  Star,
  Users,
  ArrowUp,
  ArrowRight,
  Award,
  MapPin,
  Calendar,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRoleAccess } from '@/hooks/use-role-access'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function InvestorDiscoveryPage() {
  const { user } = useAuth()

  // Role-based access control
  useRoleAccess(['INVESTOR', 'PLATFORM_ADMIN'])

  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [universities, setUniversities] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('discover')
  const [filters, setFilters] = useState({
    search: '',
    university: 'all',
    category: 'all',
    minReputation: 0,
    seekingInvestment: false,
    sortBy: 'rankingScore',
    sortOrder: 'desc',
  })

  useEffect(() => {
    fetchUniversities()
    fetchBusinesses()
  }, [filters])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      const data = await response.json()

      if (data.success) {
        setUniversities(data.data)
      }
    } catch (error) {
      console.error('Fetch universities error:', error)
    }
  }

  const fetchBusinesses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        seekingInvestment: filters.seekingInvestment.toString(),
      })

      const response = await fetch(`/api/projects?${params}`)
      const data = await response.json()

      if (data.success) {
        let filteredBusinesses = data.data || []

        // Apply client-side filters
        if (filters.search) {
          const search = filters.search.toLowerCase()
          filteredBusinesses = filteredBusinesses.filter((b: any) =>
            b.title.toLowerCase().includes(search) ||
            b.description?.toLowerCase().includes(search)
          )
        }

        if (filters.category && filters.category !== 'all') {
          filteredBusinesses = filteredBusinesses.filter((b: any) => b.category === filters.category)
        }

        if (filters.university && filters.university !== 'all') {
          filteredBusinesses = filteredBusinesses.filter((b: any) => b.universityId === filters.university)
        }

        if (filters.minReputation > 0) {
          filteredBusinesses = filteredBusinesses.filter((b: any) => {
            const avgRep = b.owner
              ? (b.owner.executionScore + b.owner.collaborationScore) / 2
              : 0
            return avgRep >= filters.minReputation
          })
        }

        // Sort
        const multiplier = filters.sortOrder === 'asc' ? 1 : -1
        filteredBusinesses.sort((a, b) => {
          const valueA = a[filters.sortBy] || 0
          const valueB = b[filters.sortBy] || 0
          return (valueB - valueA) * multiplier
        })

        setBusinesses(filteredBusinesses)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch businesses',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch businesses error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch businesses',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getUniversityName = (universityId: string) => {
    const uni = universities.find((u) => u.id === universityId)
    return uni?.name || 'Unknown'
  }

  const calculateInvestmentPotential = (business: any) => {
    const leadRep = business.owner
      ? (business.owner.executionScore + business.owner.collaborationScore) / 2
      : 0

    const progressScore = business.completionRate || 0
    const teamScore = business.teamSize || 0

    return Math.min(100, Math.round(
      (leadRep / 5 * 0.4) +      // Max 8
      (progressScore / 100 * 0.3) +  // Max 30
      (teamScore / 10 * 0.3)         // Max 3
    ) * 100)
  }

  const expressInterest = async (projectId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/investments/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: user.id,
          projectId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Interest Registered',
          description: 'Your interest has been registered',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to register interest',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Express interest error:', error)
      toast({
        title: 'Error',
        description: 'Failed to register interest',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">Investor Discovery</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investor">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Portfolio</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Discovery Filters
              </CardTitle>
              <CardDescription>Find promising student businesses to invest in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search businesses..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">University</label>
                  <Select value={filters.university} onValueChange={(value) => setFilters({ ...filters, university: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All universities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All universities</SelectItem>
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="STARTUP">Startup</SelectItem>
                      <SelectItem value="E_COMMERCE">E-Commerce</SelectItem>
                      <SelectItem value="NEWS_MEDIA">News & Media</SelectItem>
                      <SelectItem value="CONSULTING">Consulting</SelectItem>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="RESEARCH">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seeking Investment</label>
                  <Select
                    value={filters.seekingInvestment.toString()}
                    onValueChange={(value) => setFilters({ ...filters, seekingInvestment: value === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Reputation</label>
                  <Select value={filters.minReputation.toString()} onValueChange={(value) => setFilters({ ...filters, minReputation: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rankingScore">Investment Potential</SelectItem>
                      <SelectItem value="teamSize">Team Size</SelectItem>
                      <SelectItem value="completionRate">Progress</SelectItem>
                      <SelectItem value="createdAt">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Select value={filters.sortOrder} onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading businesses...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business, index) => {
                const investmentPotential = calculateInvestmentPotential(business)

                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={business.status === 'ACTIVE' ? 'default' : 'outline'}>
                            {business.status}
                          </Badge>
                          {business.seekingInvestment && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Fundraising
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Briefcase className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-2">{business.title}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {business.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4">
                        {/* Investment Potential */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">Investment Potential</span>
                            <div className="flex items-center gap-1">
                              <Progress value={investmentPotential} className="w-24" />
                              <span className="text-sm font-semibold">{investmentPotential}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Team</span>
                            </div>
                            <div className="text-lg font-semibold">{business.teamSize || 0}</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Target className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Progress</span>
                            </div>
                            <div className="text-lg font-semibold">{Math.round((business.completionRate || 0) * 100)}%</div>
                          </div>
                        </div>

                        {/* University */}
                        {business.university && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{getUniversityName(business.universityId)}</span>
                          </div>
                        )}

                        {/* Project Lead */}
                        {business.owner && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-secondary">
                                {business.owner.name?.charAt(0) || 'L'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-medium">Lead</div>
                              <div className="text-muted-foreground">{business.owner.name}</div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>{Math.round(
                                  (business.owner.executionScore + business.owner.collaborationScore) / 2
                                ).toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Investment Goal */}
                        {business.seekingInvestment && (
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Investment Goal</span>
                              <span className="text-sm font-bold">
                                ${business.investmentGoal?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Raised</span>
                              <span className="text-sm font-bold text-green-600">
                                ${business.investmentRaised?.toLocaleString() || '0'}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <div className="p-4 border-t bg-muted/30">
                        <Button
                          onClick={() => expressInterest(business.id)}
                          className="w-full"
                          disabled={!user || business.status !== 'ACTIVE'}
                        >
                          {business.seekingInvestment ? (
                            <>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Express Interest
                            </>
                          ) : (
                            <>
                              <Briefcase className="w-4 h-4 mr-2" />
                              View Details
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
