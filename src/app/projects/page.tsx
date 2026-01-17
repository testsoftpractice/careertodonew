'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (categoryFilter !== 'all') params.append('category', categoryFilter)

        const response = await fetch(`/api/projects?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setProjects(data.data || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch projects',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user, searchQuery, statusFilter, categoryFilter])

  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      return project.title?.toLowerCase().includes(searchLower) ||
             project.description?.toLowerCase().includes(searchLower)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Projects</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Browse All Projects</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover student-led projects, startups, and research initiatives
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/projects/create">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Project</span>
                <span className="sm:hidden">Create</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search projects by title, description, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          </div>

          <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'RECRUITING' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('RECRUITING')}
            >
              Recruiting
            </Button>
            <Button
              variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('COMPLETED')}
            >
              Completed
            </Button>
          </div>

          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{project.title}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-2 truncate">
                          {project.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs w-fit">{project.category}</Badge>
                          <Badge
                            variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className="text-xs w-fit"
                          >
                            {project.status}
                          </Badge>
                          {project.university && (
                            <Badge variant="outline" className="text-xs w-fit">
                              {project.university.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {project.seekingInvestment && (
                        <div className="text-green-500">
                          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">Team</div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="text-sm sm:text-base font-medium">
                          {project.teamSize || 1} member{project.teamSize > 1 ? 's' : ''}
                        </div>
                        {project.projectLead && (
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            • Lead: {project.projectLead.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">Timeline</div>
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span>
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : 'Not started'}
                        </span>
                      </div>
                    </div>

                    {project.investmentGoal && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-xs sm:text-sm text-muted-foreground">Investment</div>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <span className="font-semibold">
                            ${project.investmentGoal.toLocaleString()} goal
                          </span>
                          {project.investmentRaised && (
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              (${project.investmentRaised.toLocaleString()} raised)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {project.completionRate > 0 && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-xs sm:text-sm text-muted-foreground">Progress</div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(project.completionRate, 100)}%` }}
                          />
                        </div>
                        <div className="text-right text-xs sm:text-sm text-muted-foreground mt-1">
                          {Math.round(project.completionRate)}% complete
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 sm:pt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button variant="outline" className="flex-1 text-sm sm:text-base" asChild>
                      <Link href={`/projects/${project.id}`}>
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Link>
                    </Button>
                    <Button className="flex-1 text-sm sm:text-base" asChild>
                      <Link href={`/projects/${project.id}/tasks`}>
                        <span className="hidden sm:inline">View Tasks</span>
                        <span className="sm:hidden">Tasks</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <TrendingUp className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  {searchQuery
                    ? 'No projects match your search criteria. Try adjusting your filters.'
                    : 'There are no projects yet. Be the first to create one!'
                  }
                </p>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button variant="outline" className="text-sm sm:text-base" asChild>
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                  <Button className="text-sm sm:text-base" asChild>
                    <Link href="/projects/create">Create Project</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center pt-6 sm:pt-8">
            <Button variant="outline" className="text-sm sm:text-base" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
