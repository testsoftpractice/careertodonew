'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Settings,
  Activity,
  Flag,
  Scale,
  Download,
  Calendar,
  RefreshCw,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface AdminStats {
  totalUsers: number
  activeProjects: number
  pendingProjects: number
  completedProjects: number
  totalProjects: number
  todayActive: number
  todayCompleted: number
  todaySubmissions: number
  flaggedContent: number
  pendingApprovals: number
  rejectedProjects: number
  complianceScore: number
  systemHealth: string
  lastAudit: string
}

interface PendingProject {
  id: string
  title: string
  category: string
  university?: { name: string }
  projectLead?: { name: string; email: string }
  createdAt: string
  status: string
  completionRate: number
  description: string
}

interface AuditLog {
  id: string
  action: string
  entity: string
  performedBy?: { name: string }
  details: string
  createdAt: string
}

interface GovernanceProposal {
  id: string
  type: string
  title: string
  description: string
  priority: string
  status: string
  currentStage: string
  createdBy?: { name: string }
  createdAt: string
  projectId?: string
}

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState({
    stats: false,
    projects: false,
    audits: false,
    proposals: false,
  })

  // Data from API
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }))
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Fetch stats error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch admin statistics',
          variant: 'destructive'
        })
      } finally {
        setLoading(prev => ({ ...prev, stats: false }))
      }
    }

    fetchStats()
  }, [])

  // Fetch pending projects
  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, projects: true }))
        const response = await fetch('/api/admin/projects?status=PENDING')
        const data = await response.json()
        if (data.success) {
          setPendingProjects(data.data?.projects || [])
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
      } finally {
        setLoading(prev => ({ ...prev, projects: false }))
      }
    }

    fetchPendingProjects()
  }, [])

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(prev => ({ ...prev, audits: true }))
        const response = await fetch('/api/audits')
        const data = await response.json()
        if (data.success) {
          setAuditLogs(data.data?.logs || [])
        }
      } catch (error) {
        console.error('Fetch audits error:', error)
      } finally {
        setLoading(prev => ({ ...prev, audits: false }))
      }
    }

    if (activeTab === 'audits') {
      fetchAuditLogs()
    }
  }, [activeTab])

  // Fetch governance proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(prev => ({ ...prev, proposals: true }))
        const response = await fetch('/api/governance/proposals')
        const data = await response.json()
        if (data.success) {
          setProposals(data.data?.proposals || [])
        }
      } catch (error) {
        console.error('Fetch proposals error:', error)
      } finally {
        setLoading(prev => ({ ...prev, proposals: false }))
      }
    }

    if (activeTab === 'proposals') {
      fetchProposals()
    }
  }, [activeTab])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'LOW':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending Review</Badge>
      case 'APPROVED':
        return <Badge variant="default">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Admin Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">Governance & Oversight</h1>
                <p className="text-sm text-muted-foreground">Platform administration and compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-6 mb-8 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeProjects} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all roles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingProjects + stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.systemHealth}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Compliance: {stats.complianceScore}%
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-5xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="audits">Audit Log</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Activity</CardTitle>
                    <CardDescription>Platform activity in the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">New Projects</span>
                      <span className="font-semibold">{stats.todaySubmissions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projects Activated</span>
                      <span className="font-semibold">{stats.todayActive}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projects Completed</span>
                      <span className="font-semibold">{stats.todayCompleted}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Issues</CardTitle>
                    <CardDescription>Items requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Approvals</span>
                      <Badge variant="secondary">{stats.pendingApprovals}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Projects</span>
                      <Badge variant="secondary">{stats.pendingProjects}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Flagged Content</span>
                      <Badge variant="destructive">{stats.flaggedContent}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Pending Projects</CardTitle>
                <CardDescription>Projects awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.projects ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : pendingProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending projects
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.university?.name || 'No university'} • {project.projectLead?.name || 'No lead assigned'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(project.status)}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/projects/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Manage all projects on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Button asChild>
                    <Link href="/admin/projects">
                      View All Projects
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin/users">
                    View All Users
                    <Users className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals">
            <Card>
              <CardHeader>
                <CardTitle>Governance Proposals</CardTitle>
                <CardDescription>Review and manage governance proposals</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.proposals ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : proposals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No governance proposals
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposals.map((proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell className="font-medium">{proposal.title}</TableCell>
                          <TableCell>{proposal.type.replace(/_/g, ' ')}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(proposal.priority)}>
                              {proposal.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                          <TableCell>{proposal.createdBy?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audits">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Track all platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.audits ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No audit logs available
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 50).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>{log.entity}</TableCell>
                          <TableCell>{log.performedBy?.name || 'System'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
