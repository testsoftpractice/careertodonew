'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { History, Search, Filter, Download, Zap, Trophy, CheckCircle2, Star, Briefcase, Users, Award, Calendar, Share2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PointsHistoryProps {
  userId?: string
  limit?: number
}

export default function PointsHistory({ userId, limit = 100 }: PointsHistoryProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  const effectiveUserId = userId || user?.id

  useEffect(() => {
    if (effectiveUserId) {
      fetchTransactions()
    }
  }, [effectiveUserId])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchQuery, sourceFilter])

  const fetchTransactions = async () => {
    if (!effectiveUserId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/points?userId=${effectiveUserId}`)
      const data = await response.json()

      if (data.success) {
        setTransactions((data.data || []).slice(0, limit))
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch points history',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch points history error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch points history',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Filter by source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(tx => tx.source === sourceFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(query) ||
        tx.source.toLowerCase().includes(query)
      )
    }

    setFilteredTransactions(filtered)
  }

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      BUSINESS_CREATION: 'Business Creation',
      TASK_COMPLETION: 'Task Completion',
      MILESTONE_ACHIEVEMENT: 'Milestone Achievement',
      JOB_APPLICATION: 'Job Application',
      COLLABORATION: 'Collaboration',
      VERIFICATION_APPROVED: 'Verification Approved',
      UNIVERSITY_ACHIEVEMENT: 'University Achievement',
      RATING_RECEIVED: 'Rating Received',
      REFERRAL: 'Referral',
      EVENT_PARTICIPATION: 'Event Participation',
    }
    return labels[source] || source
  }

  const getSourceIcon = (source: string) => {
    const icons: Record<string, any> = {
      BUSINESS_CREATION: Trophy,
      TASK_COMPLETION: CheckCircle2,
      MILESTONE_ACHIEVEMENT: Star,
      JOB_APPLICATION: Briefcase,
      COLLABORATION: Users,
      VERIFICATION_APPROVED: Award,
      UNIVERSITY_ACHIEVEMENT: Calendar,
      RATING_RECEIVED: Star,
      REFERRAL: Share2,
      EVENT_PARTICIPATION: Zap,
    }
    return icons[source] || Zap
  }

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      BUSINESS_CREATION: 'text-purple-500',
      TASK_COMPLETION: 'text-green-500',
      MILESTONE_ACHIEVEMENT: 'text-yellow-500',
      JOB_APPLICATION: 'text-blue-500',
      COLLABORATION: 'text-pink-500',
      VERIFICATION_APPROVED: 'text-indigo-500',
      UNIVERSITY_ACHIEVEMENT: 'text-cyan-500',
      RATING_RECEIVED: 'text-orange-500',
      REFERRAL: 'text-red-500',
      EVENT_PARTICIPATION: 'text-teal-500',
    }
    return colors[source] || 'text-gray-500'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleExport = () => {
    const csv = [
      ['Date', 'Source', 'Description', 'Points'].join(','),
      ...filteredTransactions.map(tx =>
        [
          formatDateTime(tx.createdAt),
          getSourceLabel(tx.source),
          `"${tx.description}"`,
          tx.points,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `points-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export successful',
      description: 'CSV file downloaded',
    })
  }

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'BUSINESS_CREATION', label: 'Business Creation' },
    { value: 'TASK_COMPLETION', label: 'Task Completion' },
    { value: 'MILESTONE_ACHIEVEMENT', label: 'Milestone Achievement' },
    { value: 'JOB_APPLICATION', label: 'Job Application' },
    { value: 'COLLABORATION', label: 'Collaboration' },
    { value: 'VERIFICATION_APPROVED', label: 'Verification Approved' },
    { value: 'UNIVERSITY_ACHIEVEMENT', label: 'University Achievement' },
    { value: 'RATING_RECEIVED', label: 'Rating Received' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'EVENT_PARTICIPATION', label: 'Event Participation' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Points History
            </CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `${filteredTransactions.length} transactions`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchTransactions}>
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="text-center py-8">
            <History className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => {
                  const Icon = getSourceIcon(tx.source)

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Icon className={`w-3 h-3 ${getSourceColor(tx.source)}`} />
                          {getSourceLabel(tx.source)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        +{tx.points}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
