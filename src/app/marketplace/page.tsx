'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  DollarSign,
  ExternalLink,
  TrendingUp,
  Users,
  Target,
  Building2,
  Star,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function MarketplacePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [stageFilter, setStageFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ACTIVE')

  // Categories for filter
  const categories = ['ALL', 'TECHNOLOGY', 'CONSUMER', 'BUSINESS', 'HEALTHCARE', 'FINANCE', 'ENERGY', 'EDUCATION', 'MEDIA']

  // Stages for filter
  const stages = ['ALL', 'IDEA', 'IN_REVIEW', 'RAISED', 'FUNDING', 'NEGOTIATING', 'DEAL_AGREED']

  // Statuses for filter
  const statuses = ['ALL', 'ACTIVE', 'RECRUITING', 'COMPLETED', 'ON_HOLD']

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/marketplace/projects')
        const data = await response.json()
        if (data.success) {
          setProjects(data.data?.projects || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch projects',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'ALL' || project.category === categoryFilter
    const matchesStage = stageFilter === 'ALL' || project.fundingStage === stageFilter
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter

    return matchesSearch && matchesCategory && matchesStage && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Investment Marketplace</h1>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Filter Projects</CardTitle>
              <CardDescription>Search and filter investment opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'ALL' ? 'All Categories' : cat.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stage Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Funding Stage</label>
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage === 'ALL' ? 'All Stages' : stage.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === 'ALL' ? 'All Statuses' : status.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Results</label>
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{filteredProjects.length} projects</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading investment opportunities...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">{project.title}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-2 mt-1">
                          {project.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      <Badge variant="outline" className="text-xs w-fit">{project.category || 'Uncategorized'}</Badge>
                      <Badge variant="outline" className="text-xs w-fit">{project.status}</Badge>
                      {project.seekingInvestment && (
                        <Badge className="text-xs w-fit bg-green-500">Seeking Investment</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3 sm:space-y-4">
                    {/* Investment Goal */}
                    {project.investmentGoal && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Investment Goal</span>
                          <span className="font-semibold">${(project.investmentGoal).toLocaleString()}</span>
                        </div>
                        {project.currentRaised !== undefined && (
                          <>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Raised</span>
                              <span>{project.currentRaised.toLocaleString()}</span>
                            </div>
                            <Progress
                              value={Math.min((project.currentRaised / project.investmentGoal) * 100, 100)}
                              className="h-2"
                            />
                          </>
                        )}
                      </div>
                    )}

                    {/* Team Reputation */}
                    {project.teamReputation !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Team Reputation</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{project.teamReputation.toFixed(1)}</span>
                          </div>
                        </div>
                        <Progress value={(project.teamReputation / 5) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{project.university?.name || 'No university'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{project.teamSize || 0} team members</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 pt-3">
                    <Button variant="outline" className="flex-1 text-sm" asChild>
                      <Link href={`/projects/${project.id}`}>
                        View
                        <span className="hidden sm:inline ml-2">Details</span>
                        <ExternalLink className="h-3 w-3 ml-2 hidden sm:flex" />
                      </Link>
                    </Button>
                    {project.seekingInvestment && (
                      <Button className="flex-1 text-sm" asChild>
                        <Link href={`/marketplace/projects/${project.id}/invest`}>
                          <DollarSign className="h-3 w-3 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Invest</span>
                          <span className="sm:hidden">Express Interest</span>
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {searchQuery || categoryFilter !== 'ALL' || stageFilter !== 'ALL' || statusFilter !== 'ALL'
                    ? 'Try adjusting your filters to find more investment opportunities.'
                    : 'There are no investment opportunities available at this time.'}
                </p>
                {(searchQuery || categoryFilter !== 'ALL' || stageFilter !== 'ALL' || statusFilter !== 'ALL') && (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('ALL')
                    setStageFilter('ALL')
                    setStatusFilter('ACTIVE')
                  }}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
