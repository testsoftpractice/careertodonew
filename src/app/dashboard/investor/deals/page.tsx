'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Handshake,
  Search,
  Filter,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function InvestorDealsPage() {
  const { user } = useAuth()
  const [deals, setDeals] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({
    totalDeals: 0,
    activeDeals: 0,
    agreedDeals: 0,
    fundedDeals: 0,
    averageDaysToClose: 0,
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch deals
  useEffect(() => {
    const fetchDeals = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(
          `/api/investments/deals?investorId=${user.id}&status=${statusFilter}`
        )
        const data = await response.json()
        if (data.success) {
          setDeals(data.data.deals || [])
          setSummary(data.data.summary || {})
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch deals',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Fetch deals error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [user, statusFilter])

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      searchQuery === '' ||
      deal.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.project?.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Deal Flow</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/investor">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalDeals || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">
                  {summary.activeDeals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Agreed Deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {summary.agreedDeals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Funded Deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {summary.fundedDeals || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deals..."
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
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="AGREED">Agreed</SelectItem>
                    <SelectItem value="FUNDED">Funded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Deals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Deals</CardTitle>
              <CardDescription>
                Track your investment deals through the pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading deals...</p>
                </div>
              ) : filteredDeals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead className="hidden md:table-cell">Investor</TableHead>
                      <TableHead className="hidden sm:table-cell">Stage</TableHead>
                      <TableHead className="hidden lg:table-cell">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{deal.project?.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                              {deal.project?.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="font-medium">{deal.investor?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {deal.investor?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{deal.stage}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="font-semibold">
                            ${deal.amount?.toLocaleString() || 'N/A'}
                          </div>
                          {deal.equity && (
                            <div className="text-sm text-muted-foreground">
                              {deal.equity}% equity
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              deal.status === 'FUNDED'
                                ? 'default'
                                : deal.status === 'AGREED'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {deal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/projects/${deal.projectId}/investments/${deal.id}`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <Handshake className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Active Deals</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any active deals yet. Submit investment proposals to
                    start the deal flow.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/investor/proposals">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      View Proposals
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Average Days to Close */}
          {summary.averageDaysToClose > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your deal pipeline performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Days to Close</span>
                      <span className="font-semibold">
                        {summary.averageDaysToClose.toFixed(1)} days
                      </span>
                    </div>
                    <Progress
                      value={Math.min((summary.averageDaysToClose / 30) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold">
                        {summary.totalDeals > 0
                          ? ((summary.fundedDeals / summary.totalDeals) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        summary.totalDeals > 0
                          ? (summary.fundedDeals / summary.totalDeals) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
