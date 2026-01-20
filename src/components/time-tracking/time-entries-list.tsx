'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, MapPin, Calendar, Filter, Download } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

interface TimeEntriesListProps {
  userId?: string
  taskId?: string
  limit?: number
  showTabs?: boolean
}

export default function TimeEntriesList({
  userId,
  taskId,
  limit = 50,
  showTabs = true,
}: TimeEntriesListProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [workSessions, setWorkSessions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('entries')

  const effectiveUserId = userId || user?.id

  useEffect(() => {
    if (effectiveUserId) {
      fetchData()
    }
  }, [effectiveUserId, taskId, activeTab])

  const fetchData = async () => {
    if (!effectiveUserId) return

    setLoading(true)
    try {
      // Fetch time entries
      const entriesParams = new URLSearchParams({ userId: effectiveUserId })
      if (taskId) entriesParams.append('taskId', taskId)

      const entriesResponse = await fetch(`/api/time-entries?${entriesParams}`)
      const entriesData = await entriesResponse.json()

      if (entriesData.success) {
        setTimeEntries((entriesData.data || []).slice(0, limit))
      }

      // Fetch work sessions
      const sessionsParams = new URLSearchParams({ userId: effectiveUserId })
      const sessionsResponse = await fetch(`/api/work-sessions?${sessionsParams}`)
      const sessionsData = await sessionsResponse.json()

      if (sessionsData.success) {
        setWorkSessions((sessionsData.data || []).slice(0, limit))
      }
    } catch (error) {
      console.error('Fetch time tracking data error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch time tracking data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (hours: number | null | undefined) => {
    if (!hours) return '0h 0m'
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getTotalHours = () => {
    const totalEntriesHours = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
    const totalSessionsHours = workSessions.reduce((sum, session) => sum + (session.duration || 0), 0)
    return activeTab === 'entries' ? totalEntriesHours : totalSessionsHours
  }

  const handleExport = () => {
    const data = activeTab === 'entries' ? timeEntries : workSessions
    const csv = [
      ['Date', 'Start Time', 'End Time', 'Duration', 'Type', 'Description'].join(','),
      ...data.map((item: any) =>
        [
          formatDate(activeTab === 'entries' ? item.startTime : item.checkInTime),
          formatTime(activeTab === 'entries' ? item.startTime : item.checkInTime),
          activeTab === 'entries'
            ? (item.endTime ? formatTime(item.endTime) : 'Active')
            : (item.checkOutTime ? formatTime(item.checkOutTime) : 'Active'),
          formatDuration(item.duration),
          activeTab === 'entries' ? item.type : item.type,
          activeTab === 'entries' ? (item.description || '') : (item.notes || ''),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `time-tracking-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export successful',
      description: 'CSV file downloaded',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Tracking
            </CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `Total: ${formatDuration(getTotalHours())}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
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
      <CardContent>
        {showTabs && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="entries">Time Entries</TabsTrigger>
              <TabsTrigger value="sessions">Work Sessions</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {loading ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading time tracking data...</p>
          </div>
        ) : activeTab === 'entries' ? (
          <div className="max-h-96 overflow-y-auto">
            {timeEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No time entries found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(entry.startTime)}
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(entry.startTime)}</TableCell>
                      <TableCell>
                        {entry.endTime ? (
                          formatTime(entry.endTime)
                        ) : (
                          <Badge variant="destructive">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDuration(entry.duration)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {entry.description || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {workSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No work sessions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(session.checkInTime)}
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(session.checkInTime)}</TableCell>
                      <TableCell>
                        {session.checkOutTime ? (
                          formatTime(session.checkOutTime)
                        ) : (
                          <Badge variant="destructive">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDuration(session.duration)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.type}</Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1 max-w-xs truncate">
                        <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        {session.checkInLocation || session.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
