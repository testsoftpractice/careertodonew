'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ArrowLeft,
  Eye,
  RefreshCw,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'

interface JobDetail {
  id: string
  title: string
  description: string
  location: string
  salaryRange: string
  employmentType: string
  experienceLevel: string
  requirements: string
  benefits: string
  status: string
  approvalStatus: string
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  rejectionReason: string | null
  reviewComments: string | null
  business: {
    id: string
    name: string
    description: string
    industry: string
    website: string | null
    location: string
  }
  _count: {
    applications: number
  }
}

export default function JobReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewComments, setReviewComments] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/approvals/jobs/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch job')

      const data = await response.json()
      setJob(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load job details. Please try again.',
        variant: 'destructive',
      })
      router.push('/admin/approvals/jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const handleApprove = async () => {
    if (!job) return

    try {
      setProcessing(true)
      const response = await fetch('/api/admin/approvals/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve job')

      toast({
        title: 'Job Approved',
        description: `Job "${job.title}" has been approved and published.`,
      })

      setShowActionDialog(false)
      resetActionState()
      router.push('/admin/approvals/jobs')
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
    if (!job || !rejectionReason.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/approvals/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          reviewComments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject job')

      toast({
        title: 'Job Rejected',
        description: `Job "${job.title}" has been rejected.`,
        variant: 'destructive',
      })

      setShowActionDialog(false)
      resetActionState()
      router.push('/admin/approvals/jobs')
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

  const openActionDialog = (action: 'approve' | 'reject') => {
    setActionType(action)
    setRejectionReason('')
    setReviewComments('')
    setShowActionDialog(true)
  }

  const resetActionState = () => {
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
      CLOSED: { label: 'Closed', variant: 'outline' },
    }
    const config = statusConfig[status] || { label: status, variant: 'secondary' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/approvals/jobs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Approvals
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
                <p className="text-muted-foreground">Job Review Details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(job.approvalStatus)}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchJob}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => openActionDialog('approve')}
                className="flex-1 sm:flex-none"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve & Publish
              </Button>
              <Button
                variant="outline"
                onClick={() => openActionDialog('reject')}
                className="flex-1 sm:flex-none border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Reject
              </Button>
              <Button
                variant="ghost"
                asChild
              >
                <Link href={`/jobs/${job.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Job Description</Label>
                    <div className="mt-1 whitespace-pre-wrap">{job.description}</div>
                  </div>
                  <Separator />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Job Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Approval Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {getStatusBadge(job.approvalStatus)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Employment Type</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{job.employmentType || 'Not specified'}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Experience Level</Label>
                      <div className="mt-1">
                        <Badge variant="outline">{job.experienceLevel || 'Not specified'}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Posted Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {job.approvedAt && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Approved Date</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(job.approvedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                  {job.rejectionReason && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm text-red-500">Rejection Reason</Label>
                        <p className="mt-1 text-red-600 dark:text-red-400">{job.rejectionReason}</p>
                      </div>
                    </>
                  )}
                  {job.reviewComments && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm text-muted-foreground">Review Comments</Label>
                        <p className="mt-1">{job.reviewComments}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Applications</span>
                    </div>
                    <Badge variant="secondary">{job._count.applications}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm text-muted-foreground">Salary Range</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{job.salaryRange || 'Not specified'}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm text-muted-foreground">Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{job.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">
                    {job.business.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold">{job.business.name}</div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {job.business.industry}
                    </div>
                  </div>
                </div>
                <Separator />
                {job.business.description && (
                  <div>
                    <Label className="text-sm text-muted-foreground">About Company</Label>
                    <p className="mt-1">{job.business.description}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Company Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.business.location}</span>
                    </div>
                  </div>
                  {job.business.website && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Website</Label>
                      <div className="mt-1">
                        <Link
                          href={job.business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          {job.business.website}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {job.requirements ? (
                  <div className="whitespace-pre-wrap">{job.requirements}</div>
                ) : (
                  <p className="text-muted-foreground">No requirements specified</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                {job.benefits ? (
                  <div className="whitespace-pre-wrap">{job.benefits}</div>
                ) : (
                  <p className="text-muted-foreground">No benefits specified</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <AlertDialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <AlertDialogContent className="max-w-md w-full sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' && 'Approve Job'}
                {actionType === 'reject' && 'Reject Job'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' && `Do you want to approve "${job.title}" and publish it?`}
                {actionType === 'reject' && `Are you sure you want to reject "${job.title}"?`}
              </AlertDialogDescription>
            </AlertDialogHeader>

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
