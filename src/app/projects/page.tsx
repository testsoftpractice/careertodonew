'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200/50">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent truncate">Projects</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-bold">{filteredProjects.length}</span> project{filteredProjects.length === 1 ? '' : 's'}
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Browse All Projects</h2>
              <p className="text-sm sm:text-base text-slate-600">
                Discover student-led projects, startups, and research initiatives
              </p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-200/50" asChild>
              <Link href="/projects/create">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Project</span>
                <span className="sm:hidden">Create</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative min-w-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Search className="h-3.5 w-3.5 text-white" />
              </div>
              <Input
                placeholder="Search projects by title, description, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200/60 bg-white/50 focus:border-sky-300 focus:ring-sky-200"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-slate-200/60 bg-white/50 hover:bg-sky-50 hover:border-sky-300"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          </div>

          <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'all' ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md' : 'border-slate-200/60 bg-white/50 hover:bg-sky-50 hover:border-sky-300'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 'border-slate-200/60 bg-white/50 hover:bg-green-50 hover:border-green-300'}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'RECRUITING' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'RECRUITING' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md' : 'border-slate-200/60 bg-white/50 hover:bg-blue-50 hover:border-blue-300'}
              onClick={() => setStatusFilter('RECRUITING')}
            >
              Recruiting
            </Button>
            <Button
              variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
              size="sm"
              className={statusFilter === 'COMPLETED' ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md' : 'border-slate-200/60 bg-white/50 hover:bg-purple-50 hover:border-purple-300'}
              onClick={() => setStatusFilter('COMPLETED')}
            >
              Completed
            </Button>
          </div>

          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-sky-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-600 mt-2">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-sky-300/50 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-blue-500" />
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg text-slate-900 truncate">{project.title}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-slate-600 line-clamp-2 truncate">
                          {project.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className="bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200 text-xs w-fit">{project.category}</Badge>
                          <Badge
                            className={`text-xs w-fit border-0 ${project.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : project.status === 'RECRUITING' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' : 'bg-gradient-to-r from-purple-500 to-violet-600 text-white'}`}
                          >
                            {project.status}
                          </Badge>
                          {project.university && (
                            <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs w-fit">
                              {project.university.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {project.seekingInvestment && (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200/50">
                          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">Team</div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Users className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="text-sm sm:text-base font-medium text-slate-900">
                          {project.teamSize || 1} member{project.teamSize > 1 ? 's' : ''}
                        </div>
                        {project.owner && (
                          <span className="text-xs sm:text-sm text-slate-600">
                            • Lead: {project.owner.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">Timeline</div>
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-slate-700">
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : 'Not started'}
                        </span>
                      </div>
                    </div>

                    {project.investmentGoal && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-xs sm:text-sm text-slate-600 font-medium">Investment</div>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">৳</span>
                          </div>
                          <span className="font-semibold text-slate-900">
                            {project.investmentGoal.toLocaleString()} goal
                          </span>
                          {project.investmentRaised && (
                            <span className="text-xs sm:text-sm text-slate-600">
                              ({project.investmentRaised.toLocaleString()} raised)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {project.completionRate > 0 && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-xs sm:text-sm text-slate-600 font-medium">Progress</div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 rounded-full transition-all shadow-sm"
                            style={{ width: `${Math.min(project.completionRate, 100)}%` }}
                          />
                        </div>
                        <div className="text-right text-xs sm:text-sm text-slate-600 mt-1">
                          {Math.round(project.completionRate)}% complete
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 sm:pt-3">
                    <Button className="w-full text-sm sm:text-base bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 transition-all duration-300" asChild>
                      <Link href={`/projects/${project.id}/tasks`}>
                        <span className="hidden sm:inline">View Tasks</span>
                        <span className="sm:hidden">Tasks</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-lg">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-sky-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-900">No Projects Found</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  {searchQuery
                    ? 'No projects match your search criteria. Try adjusting your filters.'
                    : 'There are no projects yet. Be the first to create one!'
                  }
                </p>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button variant="outline" className="text-sm sm:text-base border-slate-200/60 bg-white/50 hover:bg-sky-50 hover:border-sky-300" asChild>
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                  <Button className="text-sm sm:text-base bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-200/50" asChild>
                    <Link href="/projects/create">Create Project</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center pt-6 sm:pt-8">
            <Button variant="outline" className="text-sm sm:text-base border-slate-200/60 bg-white/50 hover:bg-sky-50 hover:border-sky-300" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
