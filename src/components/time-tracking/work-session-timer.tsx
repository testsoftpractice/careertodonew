'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Play, Square, CheckCircle2, AlertCircle, Calendar, Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'

interface WorkSessionTimerProps {
  onSessionComplete?: () => void
}

interface Project {
  id: string
  title: string
  description?: string
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  projectId?: string | null
}

export default function WorkSessionTimer({ onSessionComplete }: WorkSessionTimerProps) {
  const { user } = useAuth()

  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [sessionType, setSessionType] = useState<'ONSITE' | 'REMOTE' | 'HYBRID'>('ONSITE')
  const [notes, setNotes] = useState('')
  const [checkInLocation, setCheckInLocation] = useState('')
  const [checkOutLocation, setCheckOutLocation] = useState('')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [mode, setMode] = useState<'project' | 'personal'>('project')
  const timerRef = useRef<NodeJS.Timeout>()

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
    fetchTasks()
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

  // Fetch tasks when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject)
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    if (!user) return

    try {
      const response = await authFetch('/api/projects')
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

  const fetchTasks = async () => {
    if (!user) return

    try {
      const response = await authFetch('/api/tasks')
      const data = await response.json()

      if (data.success && data.data) {
        // Filter tasks that are not completed and are assigned to user or personal
        const userTasks = data.data.filter((task: Task) =>
          task.assignedTo === user.id || (!task.projectId && !task.assignedTo)
        )
        setTasks(userTasks)
      }
    } catch (error) {
      console.error('Fetch tasks error:', error)
    }
  }

  const fetchProjectTasks = async (projectId: string) => {
    try {
      const response = await authFetch(`/api/projects/${projectId}/tasks`)
      const data = await response.json()

      if (data.success && data.data) {
        const activeTasks = data.data.filter((task: Task) => task.status !== 'DONE')
        setTasks(activeTasks)
      }
    } catch (error) {
      console.error('Fetch project tasks error:', error)
    }
  }

  const fetchActiveSession = async () => {
    if (!user) return

    try {
      const response = await authFetch(`/api/work-sessions?userId=${user.id}`)
      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        const activeSession = data.data.find((s: any) => !s.checkOutTime)
        if (activeSession) {
          setActiveSessionId(activeSession.id)
          setIsTracking(true)
          setStartTime(new Date(activeSession.startTime))
          setSessionType(activeSession.type)
          setNotes(activeSession.notes || '')
          setCheckInLocation(activeSession.checkInLocation || '')
          if (activeSession.projectId) {
            setSelectedProject(activeSession.projectId)
            setMode('project')
          } else if (activeSession.taskId) {
            setMode('personal')
            setSelectedTask(activeSession.taskId)
            // Fetch task to get its project
            if (activeSession.task) {
              const task = await fetchTaskById(activeSession.taskId)
              if (task && task.projectId) {
                setSelectedProject(task.projectId)
                fetchProjectTasks(task.projectId)
              }
            }
          } else {
            setMode('personal')
          }
        }
      }
    } catch (error) {
      console.error('Fetch active session error:', error)
    }
  }

  const fetchTaskById = async (taskId: string) => {
    try {
      const response = await authFetch(`/api/tasks/${taskId}`)
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error('Fetch task error:', error)
      return null
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

    // Validation: either project or task must be selected
    if (mode === 'project' && !selectedProject) {
      toast({
        title: 'Validation Error',
        description: 'Please select a project for project-based time tracking',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const body: any = {
        type: sessionType,
        checkInLocation: checkInLocation || undefined,
        notes: notes || undefined,
      }

      if (mode === 'project') {
        body.projectId = selectedProject
      } else if (mode === 'personal' && selectedTask) {
        body.taskId = selectedTask
      }

      const response = await authFetch('/api/work-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      const response = await authFetch(`/api/work-sessions?id=${activeSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: durationHours.toFixed(2),
          checkOutLocation: checkOutLocation || undefined,
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
      await authFetch('/api/points', {
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
        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'project' ? 'default' : 'outline'}
            onClick={() => setMode('project')}
            disabled={isTracking}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Project Time
          </Button>
          <Button
            variant={mode === 'personal' ? 'default' : 'outline'}
            onClick={() => setMode('personal')}
            disabled={isTracking}
          >
            <Square className="w-4 h-4 mr-2" />
            Personal Task Time
          </Button>
        </div>

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

        {/* Project Selection (only for project mode) */}
        {mode === 'project' && (
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
              <p className="text-xs text-muted-foreground mt-1">
                Create a project to start tracking time
              </p>
            )}
          </div>
        )}

        {/* Task Selection (only for personal mode) */}
        {mode === 'personal' && (
          <div className="space-y-2">
            <Label>Task (Optional)</Label>
            <Select
              value={selectedTask}
              onValueChange={setSelectedTask}
              disabled={isTracking}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No task selected</SelectItem>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                      <span>{task.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
              <SelectItem value="BREAK">Break</SelectItem>
              <SelectItem value="MEETING">Meeting</SelectItem>
              <SelectItem value="TRAINING">Training</SelectItem>
              <SelectItem value="RESEARCH">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location (check-in) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Check-in Location
          </Label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white/50 dark:bg-slate-800/50"
            placeholder="Enter location (e.g., Office, Home, Library)"
            value={checkInLocation}
            onChange={(e) => setCheckInLocation(e.target.value)}
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
              disabled={loading || (mode === 'project' && !selectedProject && projects.length > 0)}
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
            <>
              {/* Check-out location input */}
              <div className="flex-1 space-y-2">
                <Label>Check-out Location</Label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Location when checking out (e.g., Office, Home)"
                  value={checkOutLocation}
                  onChange={(e) => setCheckOutLocation(e.target.value)}
                  disabled={loading}
                />
              </div>
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
            </>
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
