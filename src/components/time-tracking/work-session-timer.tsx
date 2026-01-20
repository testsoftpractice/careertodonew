'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Play, Square, CheckCircle2, AlertCircle, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

interface WorkSessionTimerProps {
  taskId?: string
  onSessionComplete?: () => void
}

interface Project {
  id: string
  title: string
  description?: string
}

export default function WorkSessionTimer({ taskId, onSessionComplete }: WorkSessionTimerProps) {
  const { user } = useAuth()

  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [sessionType, setSessionType] = useState<'ONSITE' | 'REMOTE' | 'HYBRID'>('ONSITE')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout>()

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
    fetchActiveSession()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (isTracking && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTracking, startTime])

  const fetchProjects = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/projects?projectLeadId=${user.id}`)
      const data = await response.json()

      if (data.success && data.data) {
        setProjects(data.data)

        // Auto-select if only one project
        if (data.data.length === 1) {
          setSelectedProject(data.data[0].id)
        }
      }
    } catch (error) {
      console.error('Fetch projects error:', error)
    }
  }

  const fetchActiveSession = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/work-sessions?userId=${user.id}`)
      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        const activeSession = data.data.find((s: any) => !s.checkOutTime)
        if (activeSession) {
          setActiveSessionId(activeSession.id)
          setIsTracking(true)
          setStartTime(new Date(activeSession.checkInTime))
          setSessionType(activeSession.type)
          setNotes(activeSession.notes || '')
          setLocation(activeSession.checkInLocation || '')
          if (activeSession.projectId) {
            setSelectedProject(activeSession.projectId)
          }
        }
      }
    } catch (error) {
      console.error('Fetch active session error:', error)
    }
  }

  const handleCheckIn = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      })
      return
    }

    if (!selectedProject && projects.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select a project',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/work-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          taskId,
          projectId: selectedProject || undefined,
          type: sessionType,
          checkInLocation: location || undefined,
          notes: notes || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveSessionId(data.data.id)
        setIsTracking(true)
        setStartTime(new Date())
        setElapsed(0)
        toast({
          title: 'Checked in successfully',
          description: 'Work session started',
        })
      } else {
        toast({
          title: 'Check in failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Check in error:', error)
      toast({
        title: 'Check in failed',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!user || !activeSessionId) {
      toast({
        title: 'Error',
        description: 'No active session to check out',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const durationHours = elapsed / 3600

      const response = await fetch(`/api/work-sessions/${activeSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: durationHours.toFixed(2),
          checkOutLocation: location || undefined,
          notes: notes || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsTracking(false)
        setStartTime(null)
        setElapsed(0)
        setActiveSessionId(null)
        toast({
          title: 'Checked out successfully',
          description: `Work session completed: ${formatDuration(elapsed)}`,
        })

        // Award points for time tracking
        await awardPoints()

        if (onSessionComplete) {
          onSessionComplete()
        }
      } else {
        toast({
          title: 'Check out failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Check out error:', error)
      toast({
        title: 'Check out failed',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const awardPoints = async () => {
    if (!user) return

    try {
      await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          source: 'EVENT_PARTICIPATION',
          description: 'Work session tracked',
          metadata: {
            duration: formatDuration(elapsed),
            sessionType,
            projectId: selectedProject,
          },
        }),
      })
    } catch (error) {
      console.error('Award points error:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Work Session Timer
        </CardTitle>
        <CardDescription>Track your work sessions with automatic timing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Status */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-2">
            {isTracking ? (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Recording
              </Badge>
            ) : (
              <Badge variant="outline">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Tracking
              </Badge>
            )}
          </div>
          <div className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {formatDuration(elapsed)}
          </div>
        </div>

        {/* Project Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Project
          </Label>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
            disabled={isTracking || projects.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={projects.length === 0 ? "No projects available" : "Select a project"} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Create a project to start tracking time
            </p>
          )}
        </div>

        {/* Session Type Selection */}
        <div className="space-y-2">
          <Label>Session Type</Label>
          <Select
            value={sessionType}
            onValueChange={(value: any) => setSessionType(value)}
            disabled={isTracking}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONSITE">On-site</SelectItem>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white/50 dark:bg-slate-800/50"
            placeholder="Enter location (e.g., Office, Home, Library)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isTracking}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            placeholder="What are you working on?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isTracking}
            rows={3}
            className="bg-white/50 dark:bg-slate-800/50"
          />
        </div>

        {/* Check In/Out Button */}
        <div className="flex gap-3 pt-2">
          {!isTracking ? (
            <Button
              onClick={handleCheckIn}
              disabled={loading || projects.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Check In
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCheckOut}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Check Out
                </>
              )}
            </Button>
          )}
        </div>

        {/* Time Entries Link */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            const timeEntriesSection = document.getElementById('time-entries-section')
            if (timeEntriesSection) {
              timeEntriesSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Time Entries
        </Button>
      </CardContent>
    </Card>
  )
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
