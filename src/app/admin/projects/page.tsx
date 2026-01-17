'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Search,
  Filter,
  Briefcase,
  Users,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface Project {
  id: string
  title: string
  description: string
  category: string
  university: string
  projectLead: string
  status: string
  riskLevel: string
  investmentStatus: string
  submittedAt: string
  lastUpdated: string | null
}

export default function AdminProjectsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== 'all') params.append('status', statusFilter)
        params.append('limit', pageSize.toString())

        const response = await fetch(`/api/admin/projects?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setProjects(data.data?.projects || [])
          setTotalCount(data.data?.totalCount || 0)
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
  }, [statusFilter])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const filteredProjects = projects.filter(project =>
    searchQuery === '' ||
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.university.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending Review</Badge>
      case 'APPROVED':
        return <Badge className="bg-blue-500">Approved</Badge>
      case 'RECRUITING':
        return <Badge className="bg-purple-500">Recruiting</Badge>
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>
      case 'PAUSED':
        return <Badge variant="outline">Paused</Badge>
      case 'TERMINATED':
        return <Badge variant="destructive">Terminated</Badge>
      case 'PROPOSED':
        return <Badge variant="secondary">Proposed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return <Badge className="bg-green-500/10 text-green-500">Low Risk</Badge>
      case 'Medium':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Medium Risk</Badge>
      case 'High':
        return <Badge className="bg-red-500/10 text-red-500">High Risk</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/governance" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Governance</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">Project Management</h1>
                <p className="text-sm text-muted-foreground">Manage all projects on the platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">All projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter(p => p.status === 'PENDING' || p.status === 'PROPOSED').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by title or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending Review</SelectItem>
                  <SelectItem value="PROPOSED">Proposed</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="RECRUITING">Recruiting</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Projects List</CardTitle>
            <CardDescription>
              Showing {filteredProjects.length} of {totalCount} total projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No projects found matching the criteria
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{project.title}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground">
                          <Briefcase className="h-3 w-3 inline mr-1" />
                          {project.category}
                        </span>
                        <span className="text-muted-foreground">
                          {project.university}
                        </span>
                        {project.investmentStatus === 'Seeking' && (
                          <Badge variant="outline" className="text-xs">
                            Seeking Investment
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-center">
                      {getRiskBadge(project.riskLevel)}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProjects.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Page 1 of 1
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
