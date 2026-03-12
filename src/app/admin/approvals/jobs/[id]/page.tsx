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
  FileText,
  User,
  History,
  GraduationCap,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/api-response'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface JobDetail {
  id: string
  title: string
  description: string
  location: string
  salaryRange: string
  salaryMin?: number | null
  salaryMax?: number | null
  employmentType: string
  experienceLevel: string
  requirements: string
  benefits: string
  type?: string
  department?: string
  positions?: number
  metadata?: string | null
  status: string
  approvalStatus: string
  published?: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  approvedBy?: string | null
  rejectionReason: string | null
  reviewComments: string | null
  User?: {
    id: string
    name: string | null
    email: string
    avatar: string | null
    role: string
    bio: string | null
    location: string | null
    linkedinUrl: string | null
  } | null
  Business?: {
    id: string
    name: string | null
    description: string | null
    industry: string | null
    location: string | null
    website: string | null
    size: string | null
  } | null
  JobApplication: Array<{
    id: string
    createdAt: string
    status: string
    coverLetter?: string | null
    resumeUrl?: string | null
    User?: {
      id: string
      name: string | null
      email: string
      avatar: string | null
      role: string
      University?: {
        id: string
        name: string
        code: string
      } | null
      major: string | null
      graduationYear: number | null
      totalPoints: number | null
    } | null
  }>
  JobApproval: Array<{
    id: string
    status: string
    comments: string | null
    createdAt: string
    User?: {
      id: string
      name: string | null
      email: string
      avatar: string | null
    } | null
  }>
  _count: {
    JobApplication: number
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
      const response = await authFetch(`/api/admin/approvals/jobs/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch job')

      const result = await response.json()
      setJob(result.data || result)
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
      const response = await authFetch('/api/admin/approvals/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          comments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve job')

      const result = await response.json()

      toast({
        title: 'Job Approved',
        description: result.message || `Job "${job.title}" has been approved and published.`,
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
      const response = await authFetch(`/api/admin/approvals/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          reviewComments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject job')

      const result = await response.json()

      toast({
        title: 'Job Rejected',
        description: result.message || `Job "${job.title}" has been rejected.`,
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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
                    {job.type && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Job Type</Label>
                        <div className="mt-1 text-sm">{job.type}</div>
                      </div>
                    )}
                    {job.department && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Department</Label>
                        <div className="mt-1 text-sm">{job.department}</div>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm text-muted-foreground">Posted Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Last Updated</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(job.updatedAt).toLocaleDateString()}
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
                    {job.publishedAt && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Published Date</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(job.publishedAt).toLocaleDateString()}
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
                    <Badge variant="secondary">{job._count.JobApplication}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm text-muted-foreground">Salary Range</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {job.salaryMin && job.salaryMax
                          ? `৳${job.salaryMin.toLocaleString()} - ৳${job.salaryMax.toLocaleString()}`
                          : job.salaryRange || 'Not specified'}
                      </span>
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
                  {job.positions && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm text-muted-foreground">Positions Available</Label>
                        <div className="mt-1 font-semibold">{job.positions}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Created By Card */}
            {job.User && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Created By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.User.avatar || undefined} />
                      <AvatarFallback>
                        {job.User.name?.charAt(0).toUpperCase() || job.User.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{job.User.name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{job.User.email || 'No email'}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{job.User.role || 'User'}</Badge>
                        {job.User.location && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.User.location}
                          </span>
                        )}
                      </div>
                      {job.User.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.User.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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

            {job.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    {job.metadata}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company">
            {job.Business ? (
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl font-bold">
                      {job.Business.name?.charAt(0).toUpperCase() || 'B'}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold">{job.Business.name || 'Unknown'}</div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {job.Business.industry || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  {job.Business.description && (
                    <div>
                      <Label className="text-sm text-muted-foreground">About Company</Label>
                      <p className="mt-1">{job.Business.description}</p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Company Location</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.Business.location || 'Not specified'}</span>
                      </div>
                    </div>
                    {job.Business.size && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Company Size</Label>
                        <div className="mt-1 text-sm">{job.Business.size}</div>
                      </div>
                    )}
                    {job.Business.website && (
                      <div className="sm:col-span-2">
                        <Label className="text-sm text-muted-foreground">Website</Label>
                        <div className="mt-1">
                          <Link
                            href={job.Business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            {job.Business.website}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No company information available
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Applications ({job.JobApplication.length})
                </CardTitle>
                <CardDescription>People who have applied to this job</CardDescription>
              </CardHeader>
              <CardContent>
                {job.JobApplication.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {job.JobApplication.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {application.User ? (
                          <>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={application.User.avatar || undefined} />
                              <AvatarFallback>
                                {application.User.name?.charAt(0).toUpperCase() || application.User.email?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{application.User.name || 'Unknown'}</span>
                                <Badge variant="outline" className="text-xs">
                                  {application.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{application.User.email || 'No email'}</div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                {application.User.University && (
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" />
                                    {application.User.University.name}
                                  </span>
                                )}
                                {application.User.major && (
                                  <span>· {application.User.major}</span>
                                )}
                                {application.User.graduationYear && (
                                  <span>· Class of {application.User.graduationYear}</span>
                                )}
                              </div>
                              {application.User.totalPoints !== null && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <Trophy className="h-3 w-3" />
                                  {application.User.totalPoints} points
                                </div>
                              )}
                              {application.coverLetter && (
                                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm">
                                  <FileText className="h-3 w-3 inline mr-1" />
                                  <span className="text-muted-foreground">Cover letter provided</span>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex-1">
                            <div className="font-semibold">Unknown User</div>
                            <Badge variant="outline" className="text-xs">
                              {application.status}
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Approval History
                </CardTitle>
                <CardDescription>Track the approval workflow for this job</CardDescription>
              </CardHeader>
              <CardContent>
                {job.JobApproval.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approval history yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {job.JobApproval.map((approval) => (
                      <div
                        key={approval.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        {approval.User ? (
                          <>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={approval.User.avatar || undefined} />
                              <AvatarFallback>
                                {approval.User.name?.charAt(0).toUpperCase() || approval.User.email?.charAt(0).toUpperCase() || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{approval.User.name || 'Unknown'}</span>
                                <Badge
                                  variant={approval.status === 'APPROVED' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {approval.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(approval.createdAt).toLocaleString()}
                              </div>
                              {approval.comments && (
                                <p className="mt-2 text-sm p-3 bg-slate-50 dark:bg-slate-900 rounded">
                                  {approval.comments}
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex-1">
                            <div className="font-semibold">Unknown Admin</div>
                            <Badge
                              variant={approval.status === 'APPROVED' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {approval.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(approval.createdAt).toLocaleString()}
                            </div>
                            {approval.comments && (
                              <p className="mt-2 text-sm p-3 bg-slate-50 dark:bg-slate-900 rounded">
                                {approval.comments}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
