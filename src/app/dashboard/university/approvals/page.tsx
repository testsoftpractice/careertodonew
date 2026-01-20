'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  X,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  RefreshCw,
  Download,
  DollarSign,
  Users,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'

interface PendingBusiness {
  id: string
  title: string
  description: string
  category: string
  projectLead: {
    id: string
    name: string
    email: string
    avatar: string | null
    university: {
      id: string
      name: string
      code: string
      location: string
    } | null
  }
  university: {
    id: string
    name: string
    code: string
    location: string
  } | null
  createdAt: string
  members: number
  seekingInvestment: boolean
  investmentGoal: number | null
  investmentRaised: number
  teamSizeMin: number
  teamSizeMax: number
  status: string
}

export default function UniversityApprovals() {
  const [activeTab, setActiveTab] = useState('pending')
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([])
  const [processing, setProcessing] = useState<string | null>(null)

  // Fetch pending businesses for this university
  useEffect(() => {
    const fetchPendingBusinesses = async () => {
      try {
        const response = await fetch('/api/dashboard/university/pending-approvals')

        if (!response.ok) {
          throw new Error('Failed to fetch pending businesses')
        }

        const data = await response.json()

        if (data.success) {
          setPendingBusinesses(data.data.businesses || [])
        } else {
          throw new Error(data.error || 'Failed to fetch pending businesses')
        }
      } catch (error) {
        console.error('Fetch pending businesses error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch pending businesses',
          variant: 'destructive',
        })
      }
    }

    fetchPendingBusinesses()
  }, [activeTab])

  // Handle approval/rejection
  const handleApproval = async (businessId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setProcessing(businessId)

      const response = await fetch(`/api/dashboard/university/approvals/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...(reason ? { reason } : {}) }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to ' + action + ' business')
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: action === 'approve' ? 'Success' : 'Rejection ' + (reason ? ' with reason' : ''),
          description: data.message || `Business ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
          variant: 'default',
        })

        // Refresh pending businesses list
        fetchPendingBusinesses()
      } else {
        throw new Error(data.error || 'Failed to ' + action + ' business')
      }
    } catch (error) {
      console.error('Approval error:', error)
      toast({
        title: 'Error',
        description: `Failed to ${action} business`,
        variant: 'destructive',
      })
      } finally {
        setProcessing(null)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROPOSED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Proposed</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Active</Badge>
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">University Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sh" asChild>
                <Shield className="h-5 w-5 sm:h-5 sm:w-6" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">University Approval Workflow</h1>
              <p className="text-muted-foreground">Review and approve student businesses</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={fetchPendingBusinesses}>
                <RefreshCw className="h-4 w-4" />
                Refresh List
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} className="space-y-4">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved Businesses</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Businesses</TabsTrigger>
              <TabsTrigger value="all">All Businesses</TabsTrigger>
            </TabsList>

            {/* Pending Approval Tab */}
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Business Approvals</CardTitle>
                  <CardDescription>Review and approve or reject student business requests</CardDescription>
                </CardHeader>

                <CardContent>
                  {pendingBusinesses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No pending businesses</h3>
                      <p className="text-sm">Student businesses will appear here for approval</p>
                    </div>
                  ) : (
                    <>
                    {pendingBusinesses.map((business) => (
                      <Card key={business.id} className="mb-4">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div>
                                <div className="font-semibold text-lg truncate">{business.title}</div>
                                <div className="flex items-center gap-2">
                                  <Badge>{getStatusBadge(business.status)}</Badge>
                                  <div className="text-xs text-muted-foreground">
                                    Created {new Date(business.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {processing === business.id ? (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Processing...</span>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    window.open(`/businesses/${business.id}`, '_blank')
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Business Summary */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm text-muted-foreground">Business Type:</span>
                                <span className="font-medium">{business.category}</span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Project Lead:</span>
                                <div className="font-medium">{business.projectLead.name}</div>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">University:</span>
                                <div className="font-medium">{business.university?.name || 'Not assigned'}</div>
                              </div>
                            </div>

                            {business.seekingInvestment && (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-5 w-5 text-yellow-600" />
                                  <div>
                                    <div>
                                      <div className="text-sm font-medium">Seeking Investment</div>
                                      <div className="text-xs text-muted-foreground">
                                        {business.investmentGoal ? `$${business.investmentGoal.toLocaleString()} goal` : 'Not specified'}
                                      </div>
                                      {business.investmentRaised > 0 && business.investmentGoal && (
                                        <div className="flex items-center gap-2">
                                          <div className="text-sm font-medium text-blue-600">
                                            {business.investmentRaised.toLocaleString()} raised
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            of {business.investmentGoal.toLocaleString()} goal
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {business.teamSizeMin && business.teamSizeMax && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">{business.teamSizeMin}</div>
                                  <span className="text-muted-foreground">to</span>
                                  <div className="text-sm text-muted-foreground">{business.teamSizeMax}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-medium">Description:</div>
                                <p className="text-sm text-muted-foreground">
                                  {business.description.length > 100 ? `${business.description.substring(0, 97)}...` : business.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Approval Section */}
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="font-semibold">Actions</h3>
                                <p className="text-sm text-muted-foreground">
                                  Review this business and make your decision
                                </p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Created: {new Date(business.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.open(`/businesses/${business.id}`, '_blank')
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href)
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Copy Link
                              </Button>
                            </div>
                          </div>

                          {/* Approval Form */}
                          <div className="pt-4 border-t">
                            <div className="space-y-4">
                              <Label>Decision *</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Button
                                  size="lg"
                                  variant={business.status === 'PROPOSED' ? 'default' : 'outline'}
                                  onClick={() => handleApproval(business.id, 'approve')}
                                  disabled={!!processing}
                                >
                                  <ThumbsUp className="h-5 w-5 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="lg"
                                  variant={business.status === 'REJECTED' ? 'destructive' : 'outline'}
                                  onClick={() => {
                                    const reason = prompt(`Reason for rejecting "${business.title}"?`)
                                    if (reason !== null) {
                                      handleApproval(business.id, 'reject', reason)
                                    }
                                  }}
                                  disabled={!!processing}
                                >
                                  <ThumbsDown className="h-5 w-5 mr-2" />
                                  Reject
                                </Button>
                              </div>
                              <Button
                                size="lg"
                                variant="ghost"
                                onClick={() => setProcessing(business.id)}
                                disabled={!!processing}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Review More Info
                              </Button>
                            </div>
                          </div>

                          {processing === business.id && (
                            <div className="flex items-center justify-center py-4">
                              <div className="h-5 w-5 border-4 border-4 border-t-blue-500 border-r-transparent rounded-full animate-spin mx-auto" />
                              <span className="text-sm text-muted-foreground">Processing...</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    </>
                  )}
                </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Businesses Tab - Basic Implementation */}
          <TabsContent value="approved" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle>Approved Businesses</CardTitle>
                  <CardDescription>Student businesses that have been reviewed and approved</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    This shows approved businesses. The feature is ready but data fetching needs to be implemented.
                  </p>
                </CardContent>
            </Card>
          </TabsContent>

          {/* Rejected Businesses Tab - Basic Implementation */}
          <TabsContent value="rejected" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle>Rejected Businesses</CardTitle>
                  <CardDescription>Student businesses that were not approved</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    This shows rejected businesses. The feature is ready but data fetching needs to be implemented.
                  </p>
                </CardContent>
            </Card>
          </TabsContent>

          {/* All Businesses Tab - Basic Implementation */}
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle>All Businesses</CardTitle>
                  <CardDescription>Complete history of student businesses</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    This shows all businesses. The feature is ready but data fetching needs to be implemented.
                  </p>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Review</CardTitle>
            <CardDescription>Awaiting your decision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">{pendingBusinesses.length}</div>
              <div className="text-sm text-muted-foreground">Businesses pending</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Review Time</CardTitle>
            <CardDescription>Typical response time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">2.4 hrs</div>
              <div className="text-sm text-muted-foreground">Businesses avg. review time</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Rate</CardTitle>
            <CardDescription>Approval accuracy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">94%</div>
              <div className="text-sm text-muted-foreground">of decisions appealed</div>
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
    </div>
  )
}
