'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Search,
  Filter,
  Shield,
  Activity,
  User,
  Clock,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function AuditLogsPage() {
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')

  const actions = ['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN']
  const entityTypes = ['all', 'USER', 'PROJECT', 'TASK', 'INVESTMENT', 'JOB_POSTING']

  // Fetch audit logs
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/audits?action=${actionFilter}&entityType=${entityFilter}`
        )
        const data = await response.json()
        if (data.success) {
          setAudits(data.data.audits || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch audit logs',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch audits error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAudits()
  }, [actionFilter, entityFilter])

  // Filter audits locally
  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      searchQuery === '' ||
      audit.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.entityId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Get action badge variant
  const getActionVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'default'
      case 'UPDATE':
        return 'secondary'
      case 'DELETE':
        return 'destructive'
      case 'LOGIN':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Audit Logs</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <span className="hidden sm:inline">Back to Admin</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Filter Audit Logs</CardTitle>
              <CardDescription>Search and filter audit trail entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, action, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action === 'all' ? 'All Actions' : action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Entity Types' : type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAudits.length} audit entries found
            </p>
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
          </div>

          {/* Audit Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete history of platform actions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading audit logs...</p>
                </div>
              ) : filteredAudits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="hidden md:table-cell">Entity Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Entity ID</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{audit.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionVariant(audit.action)}>
                            {audit.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{audit.entityType.replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {audit.entityId}
                          </code>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm line-clamp-2 max-w-[200px]">
                            {audit.details}
                          </p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <code className="text-xs text-muted-foreground">
                            {audit.ipAddress}
                          </code>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <div className="flex items-center gap-1 justify-end text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(audit.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <Activity className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Audit Logs Found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || actionFilter !== 'all' || entityFilter !== 'all'
                      ? 'Try adjusting your filters to find more audit entries.'
                      : 'There are no audit logs available at this time.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
