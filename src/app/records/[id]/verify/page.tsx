'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  User,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  Send,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function RequestVerificationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [fetchingRecord, setFetchingRecord] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [record, setRecord] = useState<any>(null)

  const [requestVerification, setRequestVerification] = useState({
    purpose: '',
    accessDuration: 7,
    message: '',
  })

  // Fetch record details
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setFetchingRecord(true)
        const response = await fetch(`/api/records/${params.id}`)
        const data = await response.json()

        if (response.ok && data.record) {
          setRecord(data.record)
        } else {
          toast({
            title: 'Error',
            description: 'Record not found',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch record error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch record details',
          variant: 'destructive',
        })
      } finally {
        setFetchingRecord(false)
      }
    }

    if (params.id) {
      fetchRecord()
    }
  }, [params.id])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestVerification.purpose) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a purpose for verification',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId: params.id,
          requesterId: user.id,
          purpose: requestVerification.purpose,
          accessDuration: parseInt(requestVerification.accessDuration.toString()),
          message: requestVerification.message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Verification Requested',
          description: 'Verification request sent successfully! You will be notified when approved.',
        })
        setSubmitted(true)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to request verification',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Request verification error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (fetchingRecord) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href={`/dashboard/${user.role?.toLowerCase()}`} className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Request Verification</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/dashboard/${user.role?.toLowerCase()}`} className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Request Verification</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/${user.role?.toLowerCase()}`}>
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {submitted ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-20 w-20 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl font-bold mb-2">Verification Requested!</h2>
                <p className="text-muted-foreground mb-6">
                  Your request for verification has been sent successfully. The record owner will be notified
                  and can review your request.
                </p>
                <div className="p-4 bg-white rounded-lg mb-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>What happens next?</strong>
                  </div>
                  <div className="space-y-1 text-sm text-left">
                    <div>• Record owner will review your verification request</div>
                    <div>• Once approved, you'll have access to view record</div>
                    <div>• You'll receive a notification when access is granted</div>
                    <div>• Access will be automatically revoked after specified duration</div>
                  </div>
                </div>
                <Button onClick={() => router.push(`/dashboard/${user.role?.toLowerCase()}`)} className="max-w-sm mx-auto">
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : record ? (
          <>
            {/* Record Information Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Record to Verify</CardTitle>
                    <CardDescription>
                      Request verification for this professional record
                    </CardDescription>
                  </div>
                  {record.isVerified && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Record Type and Title */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Record Type</div>
                    <div className="font-semibold capitalize">{record.type?.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Title</div>
                    <div className="font-semibold">{record.title}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{record.description}</div>
                </div>

                {/* Project Context */}
                {record.projectId && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Project</div>
                    <div className="font-semibold">Linked to a platform project</div>
                  </div>
                )}

                {/* Role and Department */}
                {record.roleName && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Role</div>
                      <div className="font-semibold">{record.roleName}</div>
                    </div>
                    {record.department && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Department</div>
                        <div className="font-semibold">{record.department}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                    <div className="font-semibold">{new Date(record.startDate).toLocaleDateString()}</div>
                  </div>
                  {record.endDate && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">End Date</div>
                      <div className="font-semibold">{new Date(record.endDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>

                {/* Verification Status */}
                {record.isVerified && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-semibold text-green-600">Verified</div>
                        <div className="text-sm text-green-600/80 mt-1">
                          This record has been authenticated and cryptographically verified as accurate.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Request Form */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Request</CardTitle>
                <CardDescription>
                  Provide details about why you need to verify this record and how long you need access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Requester Info */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold mb-2">Your Information</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Requester</div>
                        <div className="font-medium">{user?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <div className="font-medium">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-3">
                    <Label htmlFor="purpose">Purpose of Verification *</Label>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        Explain why you need to verify this record
                      </div>
                      <Textarea
                        id="purpose"
                        placeholder="e.g., Employment background check for position, Due diligence for investment, Verification of experience for academic program..."
                        rows={4}
                        value={requestVerification.purpose}
                        onChange={(e) => setRequestVerification({ ...requestVerification, purpose: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Be specific about your purpose as it helps record owner understand the context
                      </p>
                    </div>
                  </div>

                  {/* Access Duration */}
                  <div className="space-y-3">
                    <Label htmlFor="accessDuration">Access Duration *</Label>
                    <div className="space-y-2">
                      <Select
                        value={requestVerification.accessDuration.toString()}
                        onValueChange={(value) => setRequestVerification({ ...requestVerification, accessDuration: parseInt(value) })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Info className="h-4 w-4" />
                          Access will be automatically revoked after the selected duration
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message (Optional) */}
                  <div className="space-y-3">
                    <Label htmlFor="message">Additional Message (Optional)</Label>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        Add any context or additional information that might help the record owner make a decision
                      </div>
                      <Textarea
                        id="message"
                        placeholder="e.g., This verification is for a summer analyst position starting in June 2025..."
                        rows={3}
                        value={requestVerification.message}
                        onChange={(e) => setRequestVerification({ ...requestVerification, message: e.target.value })}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {requestVerification.message.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium mb-1">Verification Guidelines</div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Provide clear and specific information about your purpose</li>
                          <li>• Choose an appropriate access duration based on your needs</li>
                          <li>• The record owner can approve, reject, or request more information</li>
                          <li>• Abuse of verification requests may result in restricted access</li>
                          <li>• All requests are logged for auditing purposes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/${user.role?.toLowerCase()}`)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Record Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The professional record you're looking for doesn't exist or you don't have permission to access it.
              </p>
              <Button onClick={() => router.push(`/dashboard/${user.role?.toLowerCase()}`)}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
