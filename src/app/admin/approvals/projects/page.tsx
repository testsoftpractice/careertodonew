'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/api-response'

interface Project {
  id: string
  name: string
  description: string
  status: string
  approvalStatus: string
  submissionDate: string | null
  owner: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  _count: {
    members: number
    tasks: number
  }
}

interface Stats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  requireChanges: number
}

export default function ProjectApprovalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    requireChanges: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('PENDING')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Action state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request-changes' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewComments, setReviewComments] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await authFetch(`/api/admin/approvals/projects?${params}`)
      if (!response.ok) throw new Error('Failed to fetch projects')

      const data = await response.json()
      setProjects(data.projects || [])
      setStats(data.stats || stats)
      setTotalPages(Math.ceil((data.stats?.pending || 0) / 20))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [page, filterStatus, searchTerm])

  const handleApprove = async (publishImmediately = false) => {
    if (!selectedProject) return

    try {
      setProcessing(true)
      const response = await authFetch('/api/admin/approvals/projects', {
        method: 'POST',
        body: JSON.stringify({
          projectId: selectedProject.id,
          publishImmediately,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve project')

      toast({
        title: 'Project Approved',
        description: `Project "${selectedProject.name}" has been ${publishImmediately ? 'approved and published' : 'approved'}.`,
      })

      setShowActionDialog(false)
      resetActionState()
      fetchProjects()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve project. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedProject || !rejectionReason.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await authFetch(`/api/admin/approvals/projects/${selectedProject.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          reviewComments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject project')

      toast({
        title: 'Project Rejected',
        description: `Project "${selectedProject.name}" has been rejected.`,
        variant: 'destructive',
      })

      setShowActionDialog(false)
      resetActionState()
      fetchProjects()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject project. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!selectedProject || !reviewComments.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide review comments.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await authFetch(`/api/admin/approvals/projects/${selectedProject.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          reviewComments: reviewComments.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to request changes')

      toast({
        title: 'Changes Requested',
        description: `Requested changes for "${selectedProject.name}".`,
      })

      setShowActionDialog(false)
      resetActionState()
      fetchProjects()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const openActionDialog = (project: Project, action: 'approve' | 'reject' | 'request-changes') => {
    setSelectedProject(project)
    setActionType(action)
    setRejectionReason('')
    setReviewComments('')
    setShowActionDialog(true)
  }

  const resetActionState = () => {
    setSelectedProject(null)
    setActionType(null)
    setRejectionReason('')
    setReviewComments('')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      PENDING: { label: 'Pending', variant: 'secondary' },
      UNDER_REVIEW: { label: 'Under Review', variant: 'default' },
      APPROVED: { label: 'Approved', variant: 'default' },
      REJECTED: { label: 'Rejected', variant: 'destructive' },
      REQUIRE_CHANGES: { label: 'Changes Needed', variant: 'outline' },
    }
    const config = statusConfig[status] || { label: status, variant: 'secondary' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Project Approvals</h1>
                <p className="text-muted-foreground">Review and approve project submissions</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
                <div className="text-xs text-muted-foreground">Under Review</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.requireChanges}</div>
                <div className="text-xs text-muted-foreground">Need Changes</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="REQUIRE_CHANGES">Need Changes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Projects</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${projects.length} projects found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No projects found matching your criteria
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Team Size</TableHead>
                        <TableHead>Tasks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{project.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {project.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                                {project.owner.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{project.owner.name}</div>
                                <div className="text-xs text-muted-foreground">{project.owner.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(project.approvalStatus)}</TableCell>
                          <TableCell>{project._count.members} members</TableCell>
                          <TableCell>{project._count.tasks} tasks</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/projects/${project.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(project, 'approve')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(project, 'request-changes')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Changes
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openActionDialog(project, 'reject')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <AlertDialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <AlertDialogContent className="max-w-md w-full sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' && 'Approve Project'}
                {actionType === 'reject' && 'Reject Project'}
                {actionType === 'request-changes' && 'Request Changes'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' && `Do you want to approve "${selectedProject?.name}"?`}
                {actionType === 'reject' && `Are you sure you want to reject "${selectedProject?.name}"?`}
                {actionType === 'request-changes' && `Request changes for "${selectedProject?.name}"`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {(actionType === 'reject' || actionType === 'request-changes') && (
              <div className="space-y-4 py-4">
                {actionType === 'reject' && (
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Explain why this project is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="reviewComments">
                    {actionType === 'reject' ? 'Additional Comments' : 'Review Comments *'}
                  </Label>
                  <Textarea
                    id="reviewComments"
                    placeholder={
                      actionType === 'reject'
                        ? 'Any additional comments for the project owner...'
                        : 'Describe the changes needed...'
                    }
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionType === 'approve' && (
              <div className="space-y-2 py-4">
                <Label>Publish Option</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(false)}
                    disabled={processing}
                  >
                    Approve (Keep Private)
                  </Button>
                  <Button
                    onClick={() => handleApprove(true)}
                    disabled={processing}
                  >
                    Approve & Publish
                  </Button>
                </div>
              </div>
            )}

            {(actionType === 'reject' || actionType === 'request-changes') && (
              <AlertDialogFooter>
                <AlertDialogCancel disabled={processing} onClick={resetActionState}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant={actionType === 'reject' ? 'destructive' : 'default'}
                  onClick={actionType === 'reject' ? handleReject : handleRequestChanges}
                  disabled={processing}
                >
                  {processing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                  {actionType === 'reject' ? 'Reject' : 'Request Changes'}
                </Button>
              </AlertDialogFooter>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
