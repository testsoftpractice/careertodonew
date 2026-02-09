'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Play, Square, CheckCircle2, AlertCircle, Calendar, Briefcase, Pause, Timer, CheckOut, MoreVertical } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import { Textarea } from '@/components/ui/textarea'

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
  description: string
  status: string
  priority: string
  projectId?: string | null
  taskAssignees?: Array<{
    id: string
    taskId: string
    userId: string
    user: {
      id: string
      name: string
      avatar?: string
      email?: string
    }
    assignedAt: string
    sortOrder: number
  }>
}

export default function WorkSessionTimer({ onSessionComplete }: WorkSessionTimerProps) {
  const { user } = useAuth()

  const [sessionState, setSessionState] = useState<'idle' | 'tracking' | 'paused'>('idle')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [pausedTime, setPausedTime] = useState(0)
  
  const [sessionType, setSessionType] = useState<'ONSITE' | 'REMOTE' | 'HYBRID' | 'BREAK' | 'MEETING' | 'TRAINING' | 'RESEARCH'>('ONSITE')
  const [notes, setNotes] = useState('')
  const [checkInLocation, setCheckInLocation] = useState('')
  const [checkOutLocation, setCheckOutLocation] = useState('')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('none')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<string>('none')
  const [mode, setMode] = useState<'project' | 'personal'>('project')
  const timerRef = useRef<NodeJS.Timeout>()

  // Fetch data on mount
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

  // Timer effect - only when explicitly in tracking state
  useEffect(() => {
    if (sessionState === 'tracking' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000) + pausedTime)
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [sessionState, startTime, pausedTime])

  // Fetch tasks when project changes
  useEffect(() => {
    if (selectedProject && selectedProject !== 'none') {
      fetchProjectTasks(selectedProject)
    }
  }, [selectedProject])

  // Format duration (seconds to display format)
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

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'ONSITE':
        return <MapPin className="w-4 h-4" />
      case 'REMOTE':
        return <Clock className="w-4 h-4" />
      case 'HYBRID':
        return <Clock className="w-4 h-4" />
      case 'BREAK':
        return <Pause className="w-4 h-4" />
      case 'MEETING':
        return <Briefcase className="w-4 h-4" />
      case 'TRAINING':
        return <Briefcase className="w-4 h-4" />
      case 'RESEARCH':
        return <Briefcase className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
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
      } else if (mode === 'personal' && selectedTask && selectedTask !== 'none') {
        body.taskId = selectedTask
      }

      console.log('[handleCheckIn] Creating session:', body)
      const response = await authFetch('/api/work-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const responseJson = await response.json()
      console.log('[handleCheckIn] Response:', responseJson)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[handleCheckIn] Request failed:', response.status, errorText)
        toast({
          title: 'Check in failed',
          description: errorText || `Failed to start timer (${response.status})`,
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      if (responseJson.success) {
        setActiveSessionId(responseJson.data.id)
        setSessionState('tracking')
        setStartTime(new Date())
        setElapsed(0)
        setPausedTime(0)
        toast({
          title: 'Checked in successfully',
          description: 'Work session started',
        })
      } else {
        toast({
          title: 'Check in failed',
          description: responseJson.error || 'Failed to start timer',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('[handleCheckIn] Check in error:', error)
      toast({
        title: 'Check in failed',
        description: 'Failed to start timer. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async () => {
    if (!activeSessionId || sessionState !== 'tracking') {
      console.log('[handlePause] Invalid state:', { activeSessionId, sessionState })
      return
    }

    console.log('[handlePause] Pausing session, elapsed:', elapsed)
    setSessionState('paused')
    setPausedTime(elapsed)

    toast({
      title: 'Session Paused',
      description: `Time: ${formatDuration(elapsed)} - Click Resume to continue`,
    })
  }

  const handleResume = async () => {
    if (!activeSessionId || sessionState !== 'paused') {
      console.log('[handleResume] Invalid state:', { activeSessionId, sessionState })
      return
    }

    console.log('[handleResume] Resuming session')
    setSessionState('tracking')
    // Reset start time to current time, but keep paused time offset
    setStartTime(new Date())
    toast({
      title: 'Session Resumed',
      description: 'Time tracking continued',
    })
  }

  const handleCheckOut = async () => {
    if (!activeSessionId) {
      toast({
        title: 'Error',
        description: 'No active session to check out',
        variant: 'destructive',
      })
      return
    }

    // Ensure minimum duration (at least 1 second)
    const totalElapsed = Math.max(elapsed, 1)

    console.log('[handleCheckOut] Total elapsed seconds:', totalElapsed)

    if (totalElapsed < 1) {
      toast({
        title: 'Error',
        description: 'Session must be at least 1 second to save',
        variant: 'error',
      })
      return
    }

    setLoading(true)
    try {
      const durationSeconds = totalElapsed

      const response = await authFetch(`/api/work-sessions?id=${activeSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: durationSeconds,
          endTime: new Date().toISOString(),
          checkOutLocation: checkOutLocation || undefined,
          notes: notes || undefined,
        }),
      })

      console.log('[handleCheckOut] PATCH response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[handleCheckOut] Update failed:', response.status, errorText)
        toast({
          title: 'Check out failed',
          description: errorText || `Failed to check out (${response.status})`,
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('[handleCheckOut] Response:', data)

      if (data.success) {
        setSessionState('idle')
        setStartTime(null)
        setElapsed(0)
        setPausedTime(0)
        setActiveSessionId(null)

        toast({
          title: 'Checked out successfully',
          description: `Work session completed: ${formatDuration(durationSeconds)}`,
        })

        if (onSessionComplete) {
          onSessionComplete()
        }
      } else {
        toast({
          title: 'Check out failed',
          description: data.error || data.details || 'Failed to check out',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('[handleCheckOut] Check out error:', error)
      toast({
        title: 'Check out failed',
        description: 'Failed to check out. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to fetch projects
  const fetchProjects = async () => {
    if (!user) return
    
    try {
      const response = await authFetch('/api/projects')
      if (!response.ok) return
      
      const data = await response.json()
      if (data.success && data.data?.projects) {
        setProjects(data.data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  // Helper function to fetch tasks for a project
  const fetchProjectTasks = async (projectId: string) => {
    if (!user) return
    
    try {
      const response = await authFetch(`/api/projects/${projectId}/tasks`)
      if (!response.ok) return
      
      const data = await response.json()
      if (data.success && data.data?.tasks) {
        setTasks(data.data.tasks)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  // Helper function to fetch all personal tasks
  const fetchTasks = async () => {
    if (!user) return
    
    try {
      const response = await authFetch('/api/tasks/personal')
      if (!response.ok) return
      
      const data = await response.json()
      if (data.success && data.data?.tasks) {
        setTasks(data.data.tasks)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  // Helper function to fetch active session
  const fetchActiveSession = async () => {
    if (!user) return
    
    try {
      const response = await authFetch('/api/work-sessions/active')
      if (!response.ok) return
      
      const data = await response.json()
      if (data.success && data.data?.session) {
        const session = data.data.session
        setActiveSessionId(session.id)
        setSessionState('tracking')
        setStartTime(new Date(session.startTime))
        
        // Calculate paused time if any
        if (session.pausedAt) {
          const pausedSeconds = Math.floor(
            (new Date().getTime() - new Date(session.pausedAt).getTime()) / 1000
          )
          setPausedTime(session.pausedDuration || 0 + pausedSeconds)
          setElapsed(session.duration || 0)
        } else {
          setElapsed(session.duration || 0)
          setPausedTime(0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch active session:', error)
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Work Session Timer
        </CardTitle>
        <CardDescription>
          Track your work sessions with automatic timing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Status */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div>
              {activeSessionId ? (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  Recording
                </Badge>
              ) : sessionState === 'paused' ? (
                <Badge variant="secondary" className="animate-pulse">
                  <Pause className="w-3 h-3 mr-1" />
                  Paused
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
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'project' ? 'default' : 'outline'}
            onClick={() => {
              setMode('project')
              setSelectedTask('none')
            }}
            disabled={!!activeSessionId}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Project Time
          </Button>
          <Button
            variant={mode === 'personal' ? 'default' : 'outline'}
            onClick={() => {
              setMode('personal')
              setSelectedProject('none')
              setSelectedTask('none')
            }}
            disabled={!!activeSessionId}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Personal Task Time
          </Button>
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
              onValueChange={(value: any) => {
                setSelectedProject(value)
                // Fetch tasks for the selected project
                if (value && value !== 'none') {
                  fetchProjectTasks(value)
                }
              }}
              disabled={sessionState !== 'idle'}
              className="w-full"
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder={selectedProject === 'none' ? "Select a project..." : "Selected project"} />
              </SelectTrigger>
              <SelectContent className="z-[100001]">
                <SelectItem value="none">No project selected</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <span className="font-medium">{project.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProject !== 'none' && !projects.find((p) => p.id === selectedProject) && (
              <p className="text-xs text-muted-foreground mt-1">
                Loading project tasks...
              </p>
            )}
          </div>
        )}

        {/* Task Selection (only for personal mode) */}
        {mode === 'personal' && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Select Task (Optional)
            </Label>
            <Select
              value={selectedTask || 'none'}
              onValueChange={(value: any) => setSelectedTask(value)}
              disabled={sessionState !== 'idle'}
              className="w-full"
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select a task (optional)" />
                {selectedTask && selectedTask !== 'none' && (
                  <SelectValue>{tasks.find(t => t.id === selectedTask)?.title || 'Selected task'}</SelectValue>
                )}
              </SelectTrigger>
              <SelectContent className="z-[100001]">
                <SelectItem value="none">No task selected</SelectItem>
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
            {selectedTask && selectedTask !== 'none' && !tasks.find(t => t.id === selectedTask) && (
              <p className="text-xs text-muted-foreground mt-1">
                Loading task details...
              </p>
            )}
          </div>
        )}

        {/* Session Type Selection - Always visible */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Session Type
          </Label>
          <Select
            value={sessionType}
            onValueChange={(value: any) => setSessionType(value)}
            disabled={!!activeSessionId}
            className="w-full"
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select session type" />
            </SelectTrigger>
            <SelectContent className="z-[100001]">
              <SelectItem value="ONSITE">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-2" />
                  <span className="font-medium">On-site</span>
                </div>
              </SelectItem>
              <SelectItem value="REMOTE">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-2" />
                  <span className="font-medium">Remote</span>
                </div>
              </SelectItem>
              <SelectItem value="HYBRID">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-2" />
                  <span className="font-medium">Hybrid</span>
                </div>
              </SelectItem>
              <SelectItem value="BREAK">
                <div className="flex items-center gap-2">
                  <Pause className="w-4 h-4 text-2" />
                  <span className="font-medium">Break</span>
                </div>
              </SelectItem>
              <SelectItem value="MEETING">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Meeting</span>
                </div>
              </SelectItem>
              <SelectItem value="TRAINING">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Training</span>
                </div>
              </SelectItem>
              <SelectItem value="RESEARCH">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Research</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Check-in Location */}
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
            disabled={sessionState !== 'idle'}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <Textarea
            placeholder="Add notes about this work session..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={sessionState !== 'idle'}
            className="resize-none"
          />
        </div>

        {/* Action Buttons */}
        {!activeSessionId ? (
          // No active session - Show "Start New Session" button
          <div className="flex justify-center">
            <Button
              onClick={handleCheckIn}
              disabled={loading || (mode === 'project' && selectedProject === 'none')}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg cursor-pointer"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start New Session
                </>
              )}
            </Button>
          </div>
        ) : sessionState === 'tracking' ? (
          // Currently tracking - Show Pause button
          <Button
            onClick={handlePause}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg cursor-pointer"
            size="lg"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause Tracking
          </Button>
        ) : sessionState === 'paused' ? (
          // Paused - Show Resume and Check Out buttons
          <div className="flex gap-2">
            <Button
              onClick={handleResume}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg cursor-pointer"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Resuming...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg cursor-pointer"
              size="lg"
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
          </div>
        ) : (
          // Idle state - shouldn't happen with active session present
          <div className="flex justify-center">
            <Button
              onClick={() => {
                if (activeSessionId) {
                  console.log('[Manual Start] Starting tracking despite active session')
                  toast({
                    title: 'Warning',
                    description: 'You have an active session. This will start a new session.',
                    variant: 'default',
                  })
                } else {
                  handleCheckIn()
                }
              }}
              disabled={loading || (mode === 'project' && selectedProject === 'none')}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg cursor-pointer"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
