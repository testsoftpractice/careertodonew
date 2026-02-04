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
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  Target,
  FileText,
  MapPin,
  Building2,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'

interface ProjectDetail {
  id: string
  name: string
  description: string
  status: string
  approvalStatus: string
  submissionDate: string | null
  approvedAt: string | null
  rejectionReason: string | null
  reviewComments: string | null
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string
    email: string
    avatar: string | null
    major: string | null
    university: {
      id: string
      name: string
    } | null
  }
  members: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
      avatar: string | null
    }
    role: string
  }>
  tasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    dueDate: string | null
  }>
  milestones: Array<{
    id: string
    title: string
    description: string
    status: string
    dueDate: string | null
  }>
  _count: {
    members: number
    tasks: number
    milestones: number
  }
}

export default function ProjectReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request-changes' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewComments, setReviewComments] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/approvals/projects/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch project')

      const data = await response.json()
      setProject(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load project details. Please try again.',
        variant: 'destructive',
      })
      router.push('/admin/approvals/projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const handleApprove = async (publishImmediately = false) => {
    if (!project) return

    try {
      setProcessing(true)
      const response = await fetch('/api/admin/approvals/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          publishImmediately,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve project')

      toast({
        title: 'Project Approved',
        description: `Project "${project.name}" has been ${publishImmediately ? 'approved and published' : 'approved'}.`,
      })

      setShowActionDialog(false)
      resetActionState()
      router.push('/admin/approvals/projects')
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
    if (!project || !rejectionReason.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/approvals/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          reviewComments: reviewComments.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject project')

      toast({
        title: 'Project Rejected',
        description: `Project "${project.name}" has been rejected.`,
        variant: 'destructive',
      })

      setShowActionDialog(false)
      resetActionState()
      router.push('/admin/approvals/projects')
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
    if (!project || !reviewComments.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please provide review comments.',
        variant: 'destructive',
      })
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/approvals/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewComments: reviewComments.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to request changes')

      toast({
        title: 'Changes Requested',
        description: `Requested changes for "${project.name}".`,
      })

      setShowActionDialog(false)
      resetActionState()
      router.push('/admin/approvals/projects')
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

  const openActionDialog = (action: 'approve' | 'reject' | 'request-changes') => {
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
      REQUIRE_CHANGES: { label: 'Changes Needed', variant: 'outline' },
    }
    const config = statusConfig[status] || { label: status, variant: 'secondary' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
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
                <Link href="/admin/approvals/projects">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Approvals
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground">Project Review Details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(project.approvalStatus)}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchProject}
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
                Approve Project
              </Button>
              <Button
                variant="outline"
                onClick={() => openActionDialog('request-changes')}
                className="flex-1 sm:flex-none"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Request Changes
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
                <Link href={`/projects/${project.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="mt-1">{project.description}</p>
                  </div>
                  <Separator />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Project Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Approval Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {getStatusBadge(project.approvalStatus)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Submission Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Created</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {project.rejectionReason && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm text-red-500">Rejection Reason</Label>
                        <p className="mt-1 text-red-600 dark:text-red-400">{project.rejectionReason}</p>
                      </div>
                    </>
                  )}
                  {project.reviewComments && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm text-muted-foreground">Review Comments</Label>
                        <p className="mt-1">{project.reviewComments}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg">
                      {project.owner.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{project.owner.name}</div>
                      <div className="text-sm text-muted-foreground">{project.owner.email}</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {project.owner.major && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Major</Label>
                        <p className="text-sm">{project.owner.major}</p>
                      </div>
                    )}
                    {project.owner.university && (
                      <div>
                        <Label className="text-sm text-muted-foreground">University</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{project.owner.university.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({project._count.members})</CardTitle>
              </CardHeader>
              <CardContent>
                {project.members.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No team members yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            {member.user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{member.user.name}</div>
                            <div className="text-sm text-muted-foreground">{member.user.email}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks ({project._count.tasks})</CardTitle>
              </CardHeader>
              <CardContent>
                {project.tasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks created yet</p>
                ) : (
                  <div className="space-y-3">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold">{task.title}</div>
                          {task.dueDate && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{task.priority}</Badge>
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones ({project._count.milestones})</CardTitle>
              </CardHeader>
              <CardContent>
                {project.milestones.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No milestones defined yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold">{milestone.title}</div>
                          {getStatusBadge(milestone.status)}
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                        )}
                        {milestone.dueDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-3 w-3" />
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
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
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' && 'Approve Project'}
                {actionType === 'reject' && 'Reject Project'}
                {actionType === 'request-changes' && 'Request Changes'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' && `Do you want to approve "${project.name}"?`}
                {actionType === 'reject' && `Are you sure you want to reject "${project.name}"?`}
                {actionType === 'request-changes' && `Request changes for "${project.name}"`}
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
