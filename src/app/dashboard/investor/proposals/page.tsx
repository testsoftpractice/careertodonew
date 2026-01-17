'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  Send,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Plus,
  Search,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function InvestorProposalsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('list')
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    projectId: '',
    type: 'EQUITY',
    amount: '',
    equity: '',
    terms: '',
    message: '',
  })

  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(
          `/api/investments/proposals?investorId=${user.id}&status=${statusFilter}`
        )
        const data = await response.json()
        if (data.success) {
          setProposals(data.data || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch proposals',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch proposals error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'list') {
      fetchProposals()
    }
  }, [activeTab, user, statusFilter])

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        const response = await fetch('/api/projects?seekingInvestment=true')
        const data = await response.json()
        if (data.success) {
          setProjects(data.data || [])
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
      }
    }

    if (activeTab === 'create') {
      fetchProjects()
    }
  }, [activeTab, user])

  // Filter proposals
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchQuery === '' ||
      proposal.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.project?.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Submit proposal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit a proposal',
        variant: 'destructive',
      })
      return
    }

    if (!formData.projectId) {
      toast({
        title: 'Error',
        description: 'Please select a project',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/investments/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: formData.projectId,
          investorId: user.id,
          type: formData.type,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          equity: formData.equity ? parseFloat(formData.equity) : null,
          terms: formData.terms,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Investment proposal submitted successfully',
        })
        setFormData({
          projectId: '',
          type: 'EQUITY',
          amount: '',
          equity: '',
          terms: '',
          message: '',
        })
        setActiveTab('list')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit proposal',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Submit proposal error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit proposal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Investment Proposals</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/investor">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">My Proposals</TabsTrigger>
              <TabsTrigger value="create">Create Proposal</TabsTrigger>
            </TabsList>

            {/* List Tab */}
            <TabsContent value="list" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Investment Proposals</CardTitle>
                  <CardDescription>Track and manage your investment proposals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search proposals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="INTERESTED">Interested</SelectItem>
                        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                        <SelectItem value="AGREED">Agreed</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Proposals List */}
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading proposals...</p>
                </div>
              ) : filteredProposals.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {filteredProposals.map((proposal) => (
                    <Card key={proposal.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle>{proposal.project?.title || 'Unknown Project'}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {proposal.project?.description || 'No description'}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              proposal.status === 'AGREED'
                                ? 'default'
                                : proposal.status === 'UNDER_REVIEW'
                                ? 'secondary'
                                : proposal.status === 'REJECTED'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Investment Type</div>
                            <div className="font-medium">{proposal.type}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Amount</div>
                            <div className="font-semibold">
                              ${proposal.amount?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Equity</div>
                            <div className="font-semibold">{proposal.equity || 0}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Submitted</div>
                            <div className="font-medium">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Expires {new Date(proposal.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="pt-3 border-t">
                        <Button className="w-full" variant="outline" asChild>
                          <Link href={`/dashboard/investor/deals/${proposal.id}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Proposals Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't submitted any investment proposals yet. Create your first
                      proposal to start investing in student-led projects.
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Proposal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Investment Proposal</CardTitle>
                  <CardDescription>
                    Create a new investment proposal for a project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Project *</label>
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, projectId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project to invest in" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title} - ${project.investmentGoal?.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Investment Type *</label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EQUITY">Equity</SelectItem>
                          <SelectItem value="REVENUE_SHARE">Revenue Share</SelectItem>
                          <SelectItem value="CONVERTIBLE_NOTE">Convertible Note</SelectItem>
                          <SelectItem value="GRANT">Grant</SelectItem>
                          <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Investment Amount ($)</label>
                        <Input
                          type="number"
                          placeholder="50000"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Equity Percentage (%)</label>
                        <Input
                          type="number"
                          placeholder="10"
                          value={formData.equity}
                          onChange={(e) =>
                            setFormData({ ...formData, equity: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Investment Terms</label>
                      <Textarea
                        placeholder="Describe your investment terms and conditions..."
                        value={formData.terms}
                        onChange={(e) =>
                          setFormData({ ...formData, terms: e.target.value })
                        }
                        rows={4}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message (Optional)</label>
                      <Textarea
                        placeholder="Add a message for the project team..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Proposal
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
