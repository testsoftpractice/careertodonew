'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Send,
  Filter,
  Download,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

interface LeaveRequest {
  id: string
  userId: string
  leaveType: 'SICK' | 'VACATION' | 'PERSONAL' | 'BEREAVEMENT' | 'OTHER'
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

interface LeaveManagementProps {
  userId?: string
  compact?: boolean
}

export default function LeaveManagement({ userId, compact = false }: LeaveManagementProps) {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [formData, setFormData] = useState({
    leaveType: 'SICK' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const effectiveUserId = userId || user?.id

  useEffect(() => {
    if (effectiveUserId) {
      fetchLeaves()
    }
  }, [effectiveUserId])

  const fetchLeaves = async () => {
    if (!effectiveUserId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/leave-requests?userId=${effectiveUserId}`)
      const data = await response.json()

      if (data.success) {
        setLeaves(data.data || [])
      }
    } catch (error) {
      console.error('Fetch leaves error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch leave requests',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!effectiveUserId) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      })
      return
    }

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: 'Validation Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Leave Request Submitted',
          description: 'Your leave request has been submitted for approval',
        })
        setShowForm(false)
        setFormData({
          leaveType: 'SICK',
          startDate: '',
          endDate: '',
          reason: '',
        })
        fetchLeaves()
      } else {
        toast({
          title: 'Submission Failed',
          description: data.error || 'Failed to submit leave request',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Submit leave error:', error)
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit leave request',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getFilteredLeaves = () => {
    if (filter === 'ALL') return leaves
    return leaves.filter(leave => leave.status === filter)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'PENDING':
      default:
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SICK: 'Sick Leave',
      VACATION: 'Vacation',
      PERSONAL: 'Personal',
      BEREAVEMENT: 'Bereavement',
      OTHER: 'Other',
    }
    return labels[type] || type
  }

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'SICK':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'VACATION':
        return <MapPin className="w-4 h-4 text-blue-500" />
      case 'PERSONAL':
        return <FileText className="w-4 h-4 text-purple-500" />
      case 'BEREAVEMENT':
        return <AlertCircle className="w-4 h-4 text-slate-500" />
      default:
        return <FileText className="w-4 h-4 text-amber-500" />
    }
  }

  if (compact) {
    return (
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Leave Management
              </CardTitle>
              <CardDescription>
                {leaves.filter(l => l.status === 'PENDING').length} pending requests
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Leave
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading leave requests...</p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No leave requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.slice(0, 3).map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getLeaveTypeIcon(leave.leaveType)}
                      <span className="font-medium text-sm">{getLeaveTypeLabel(leave.leaveType)}</span>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(leave.startDate)}</span>
                    <span>→</span>
                    <span>{formatDate(leave.endDate)}</span>
                    <span className="ml-auto">{calculateDays(leave.startDate, leave.endDate)} days</span>
                  </div>
                </div>
              ))}
              {leaves.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  View All ({leaves.length}) Requests
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* Leave Request Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Request Leave</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowForm(false)}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type *</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, leaveType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SICK">Sick Leave</SelectItem>
                        <SelectItem value="VACATION">Vacation</SelectItem>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="BEREAVEMENT">Bereavement</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {formData.startDate && formData.endDate && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Total duration: {calculateDays(formData.startDate, formData.endDate)} days
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="Please provide a reason for your leave request..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Card>
    )
  }

  // Full version
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              Leave Management
            </CardTitle>
            <CardDescription>
              Manage your leave requests and track approval status
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeaves}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Leave
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{leaves.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Requests</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {leaves.filter(l => l.status === 'PENDING').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Pending</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {leaves.filter(l => l.status === 'APPROVED').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Approved</div>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {leaves.filter(l => l.status === 'REJECTED').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Rejected</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className={filter === status ? '' : 'bg-white/50 dark:bg-slate-800/50'}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading leave requests...</p>
          </div>
        ) : getFilteredLeaves().length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Leave Requests</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {filter === 'ALL' ? 'You haven\'t submitted any leave requests yet.' : `No ${filter.toLowerCase()} leave requests.`}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Leave
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredLeaves().map((leave) => (
              <div
                key={leave.id}
                className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getLeaveTypeIcon(leave.leaveType)}
                      <div>
                        <h4 className="font-semibold">{getLeaveTypeLabel(leave.leaveType)}</h4>
                        <div className="text-sm text-muted-foreground">
                          Requested on {formatDate(leave.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">Start Date</div>
                          <div className="font-medium">{formatDate(leave.startDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">End Date</div>
                          <div className="font-medium">{formatDate(leave.endDate)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">Duration:</span>{' '}
                      {calculateDays(leave.startDate, leave.endDate)} days
                    </div>

                    <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-muted-foreground mb-1">Reason</div>
                      <div className="text-sm">{leave.reason}</div>
                    </div>

                    {leave.status === 'REJECTED' && leave.rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <div className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">Rejection Reason</div>
                        <div className="text-sm text-red-700 dark:text-red-300">{leave.rejectionReason}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-2">
                    {getStatusBadge(leave.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Leave Request Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Request Leave</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select
                    value={formData.leaveType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, leaveType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SICK">Sick Leave</SelectItem>
                      <SelectItem value="VACATION">Vacation</SelectItem>
                      <SelectItem value="PERSONAL">Personal</SelectItem>
                      <SelectItem value="BEREAVEMENT">Bereavement</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {formData.startDate && formData.endDate && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Total duration: {calculateDays(formData.startDate, formData.endDate)} days
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="Please provide a reason for your leave request..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
