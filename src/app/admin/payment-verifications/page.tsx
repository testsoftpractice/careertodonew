'use client'

import { useState, useEffect } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Building2,
  GraduationCap,
} from 'lucide-react'

interface PaymentVerification {
  id: string
  name: string
  email: string
  transactionId: string
  paymentVerified: boolean
  paymentVerifiedAt: string | null
  paymentVerifiedBy: string | null
  verifiedByName: string | null
  verificationStatus: string
  role: string
  university: { name: string } | null
  major: string | null
  graduationYear: number | null
  createdAt: string
}

export default function PaymentVerificationsPage() {
  const [verifications, setVerifications] = useState<PaymentVerification[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [selectedVerification, setSelectedVerification] = useState<PaymentVerification | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchVerifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      })

      const response = await authFetch(`/api/admin/payment-verifications?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch verifications')
      }

      const data = await response.json()

      if (data.success) {
        setVerifications(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch verifications',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch verifications error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch verifications',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVerifications()
  }, [page, status, search])

  const handleApprove = async () => {
    if (!selectedVerification) return

    setActionLoading(true)
    try {
      const response = await authFetch(`/api/admin/payment-verifications/${selectedVerification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          adminId: 'current-admin-id', // In real app, get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve payment')
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Payment approved successfully',
        })
        setShowApproveDialog(false)
        setSelectedVerification(null)
        fetchVerifications()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to approve payment',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Approve payment error:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve payment',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedVerification) return

    setActionLoading(true)
    try {
      const response = await authFetch(`/api/admin/payment-verifications/${selectedVerification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          adminId: 'current-admin-id', // In real app, get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject payment')
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Payment rejected successfully',
        })
        setShowRejectDialog(false)
        setSelectedVerification(null)
        fetchVerifications()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to reject payment',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Reject payment error:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject payment',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return <Badge className="bg-blue-500">Under Review</Badge>
      case 'VERIFIED':
        return <Badge className="bg-green-500">Verified</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Verifications</h1>
            <p className="text-muted-foreground mt-1">Review and manage student payment verifications</p>
          </div>
          <Button onClick={fetchVerifications} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or transaction ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
            <CardDescription>
              {verifications.length} verification{verifications.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && verifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No verifications found</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{verification.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {verification.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{verification.transactionId}</TableCell>
                        <TableCell>{getStatusBadge(verification.verificationStatus)}</TableCell>
                        <TableCell>
                          {verification.university?.name || 'N/A'}
                          {verification.major && (
                            <div className="text-sm text-muted-foreground">
                              <GraduationCap className="h-3 w-3 inline mr-1" />
                              {verification.major}
                              {verification.graduationYear && ` (${verification.graduationYear})`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(verification.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {verification.verifiedByName ? (
                            <div className="text-sm">{verification.verifiedByName}</div>
                          ) : verification.paymentVerifiedAt ? (
                            <div className="text-sm text-muted-foreground">Unknown</div>
                          ) : (
                            <div className="text-sm text-muted-foreground">-</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!verification.paymentVerified && verification.verificationStatus === 'UNDER_REVIEW' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedVerification(verification)
                                  setShowRejectDialog(true)
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedVerification(verification)
                                  setShowApproveDialog(true)
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the payment verification for{' '}
              <span className="font-semibold">{selectedVerification?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">{selectedVerification.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{selectedVerification.email}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the payment verification for{' '}
              <span className="font-semibold">{selectedVerification?.name}</span>?
              This will clear their transaction ID and they will need to resubmit.
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">{selectedVerification.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{selectedVerification.email}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
