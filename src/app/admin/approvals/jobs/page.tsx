'use client'

import { useEffect, useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ArrowLeft,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Clock,
  FileText,
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/api-response'

interface Job {
  id: string
  title: string
  description: string
  location: string
  salaryRange: string
  status: string
  approvalStatus: string
  employmentType?: string
  experienceLevel?: string
  type?: string
  department?: string
  positions?: number
  postedDate: string
  applicationCount: number
  companyName?: string
  industry?: string
  deadline?: string
}

interface Stats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
}

export default function JobApprovalsPage() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('PENDING')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Action state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewComments, setReviewComments] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await authFetch(`/api/admin/approvals/jobs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')

      const result = await response.json()
      const data = result.data || result
      setJobs(data.jobs || [])
      setStats(data.stats || stats)
      setTotalPages(Math.ceil((data.pagination?.total || 0) / 20))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [page, filterStatus, searchTerm])

  const handleApprove = async () => {
    if (!selectedJob) return

    try {
      setProcessing(true)
      const response = await authFetch('/api/admin/approvals/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          comments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve job')

      const result = await response.json()

      toast({
        title: 'Job Approved',
        description: result.message || `Job "${selectedJob.title}" has been approved and published.`,
      })

      setShowActionDialog(false)
      resetActionState()
      fetchJobs()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve job. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedJob || !rejectionReason.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await authFetch(`/api/admin/approvals/jobs/${selectedJob.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          reviewComments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject job')

      const result = await response.json()

      toast({
        title: 'Job Rejected',
        description: result.message || `Job "${selectedJob.title}" has been rejected.`,
        variant: 'destructive',
      })

      setShowActionDialog(false)
      resetActionState()
      fetchJobs()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject job. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const openActionDialog = (job: Job, action: 'approve' | 'reject') => {
    setSelectedJob(job)
    setActionType(action)
    setRejectionReason('')
    setReviewComments('')
    setShowActionDialog(true)
  }

  const resetActionState = () => {
    setSelectedJob(null)
    setActionType(null)
    setRejectionReason('')
    setReviewComments('')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
      PENDING: { 
        label: 'Pending', 
        variant: 'secondary',
        icon: <Clock className="h-3 w-3" />
      },
      UNDER_REVIEW: { 
        label: 'Under Review', 
        variant: 'default',
        icon: <Eye className="h-3 w-3" />
      },
      APPROVED: { 
        label: 'Approved', 
        variant: 'default',
        icon: <CheckCircle2 className="h-3 w-3 text-emerald-600" />
      },
      REJECTED: { 
        label: 'Rejected', 
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3 text-red-600" />
      },
    }
    const config = statusConfig[status] || { label: status, variant: 'secondary' }
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
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
                <h1 className="text-2xl sm:text-3xl font-bold">Job Approvals</h1>
                <p className="text-muted-foreground">Review and approve job postings</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
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
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or company..."
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
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Jobs Table - Minimal Data */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs Pending Approval</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${jobs.length} jobs found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No jobs found matching your criteria
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium max-w-[300px]">
                            <div>
                              <div className="font-semibold">{job.title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {job.type || 'Full-time'}
                                {job.positions && job.positions > 1 && <span className="text-muted-foreground">· {job.positions} positions</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{job.companyName || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{job.postedDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-3.5 text-muted-foreground" />
                              <span className="font-semibold">{job.applicationCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(job.approvalStatus)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Open job detail view
                                  window.location.href = `/admin/approvals/jobs/${job.id}`
                                }}
                                title="View Full Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {job.approvalStatus === 'PENDING' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openActionDialog(job, 'approve')}
                                    className="text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openActionDialog(job, 'reject')}
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                    title="Reject"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
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
                {actionType === 'approve' && 'Approve Job'}
                {actionType === 'reject' && 'Reject Job'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' && `Do you want to approve "${selectedJob?.title}" and publish it?`}
                {actionType === 'reject' && `Are you sure you want to reject "${selectedJob?.title}"?`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {actionType === 'approve' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="approvalComments">Review Comments (Optional)</Label>
                  <Textarea
                    id="approvalComments"
                    placeholder="Any comments for the business about this approval..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Explain why this job is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewComments">Additional Comments</Label>
                  <Textarea
                    id="reviewComments"
                    placeholder="Any additional comments for the business..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={processing} onClick={resetActionState}>
                Cancel
              </AlertDialogCancel>
              {actionType === 'approve' ? (
                <Button onClick={handleApprove} disabled={processing}>
                  {processing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                  Approve & Publish
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={processing}
                >
                  {processing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                  Reject
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
