'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft, Plus, Clock, CheckCircle2, Circle, Play, Pause,
  Search, BarChart3, GitBranch, Timer, Activity,
  Target, AlertTriangle, Calendar,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  role: string
  avatar?: string
}

interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  assignedTo: string
  estimatedHours: number
  actualHours: number
  dueDate?: Date
  completedAt?: Date
  dependsOn: string[]
  blocks: string[]
  tags: string[]
  checklist: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  item: string
  completed: boolean
  completedAt?: Date
}

interface TimeEntry {
  id: string
  taskId: string
  userId: string
  startTime: Date
  endTime?: Date
  duration: number
  description?: string
}

const demoUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Project Lead' },
  { id: '2', name: 'Michael Chen', role: 'Tech Lead' },
  { id: '3', name: 'Emily Davis', role: 'Frontend Dev' },
  { id: '4', name: 'James Wilson', role: 'Backend Dev' },
]

const demoTasks: Task[] = [
  {
    id: '1',
    title: 'System Architecture Design',
    description: 'Create comprehensive system architecture including microservices, data flow, and scalability patterns',
    status: 'DONE',
    priority: 'CRITICAL',
    assignedTo: '1',
    estimatedHours: 16,
    actualHours: 18.5,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dependsOn: [],
    blocks: [],
    tags: ['architecture', 'critical'],
    checklist: [
      { id: 'c1', item: 'Define core services', completed: true },
      { id: 'c2', item: 'Create data flow diagrams', completed: true },
      { id: 'c3', item: 'Document API contracts', completed: true },
    ],
  },
  {
    id: '2',
    title: 'Authentication Service',
    description: 'Build JWT-based authentication service with refresh tokens',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    assignedTo: '2',
    estimatedHours: 24,
    actualHours: 18.5,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    dependsOn: ['1'],
    blocks: [],
    tags: ['security', 'auth'],
    checklist: [
      { id: 'c5', item: 'Setup JWT library', completed: true },
      { id: 'c6', item: 'Implement login endpoint', completed: true },
      { id: 'c7', item: 'Add refresh token logic', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Database Schema Design',
    description: 'Create database schema with proper relationships and indexes',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedTo: '4',
    estimatedHours: 20,
    actualHours: 12.5,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    dependsOn: ['1'],
    blocks: [],
    tags: ['database', 'backend'],
    checklist: [
      { id: 'c10', item: 'Define User model', completed: true },
      { id: 'c11', item: 'Create Project model', completed: true },
      { id: 'c12', item: 'Add performance indexes', completed: false },
    ],
  },
  {
    id: '4',
    title: 'RESTful API Implementation',
    description: 'Implement all CRUD endpoints for projects, tasks, users',
    status: 'TODO',
    priority: 'HIGH',
    assignedTo: '4',
    estimatedHours: 40,
    actualHours: 0,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    dependsOn: ['2', '3'],
    blocks: [],
    tags: ['api', 'backend'],
    checklist: [
      { id: 'c14', item: 'Setup API structure', completed: false },
      { id: 'c15', item: 'Create User endpoints', completed: false },
      { id: 'c16', item: 'Create Project endpoints', completed: false },
    ],
  },
]

export default function EnterpriseWorkshopDemo() {
  const [tasks, setTasks] = useState<Task[]>(demoTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('board')
  const [activeTimers, setActiveTimers] = useState<Record<string, { startTime: Date, elapsed: number }>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(taskId => {
          if (updated[taskId]) {
            const now = new Date()
            const elapsed = (now.getTime() - updated[taskId].startTime.getTime()) / 1000 / 60
            updated[taskId] = { ...updated[taskId], elapsed }
          }
        })
        return updated
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const startTimer = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status !== 'IN_PROGRESS') return

    setActiveTimers(prev => ({
      ...prev,
      [taskId]: { startTime: new Date(), elapsed: 0 }
    }))
  }

  const stopTimer = (taskId: string) => {
    const timer = activeTimers[taskId]
    if (!timer) return

    setTasks(tasks.map(t => t.id === taskId ? { ...t, actualHours: t.actualHours + timer.elapsed / 60 } : t))
    setActiveTimers(prev => {
      const updated = { ...prev }
      delete updated[taskId]
      return updated
    })
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId)

    if (task?.status === 'IN_PROGRESS' && newStatus !== 'IN_PROGRESS') {
      stopTimer(taskId)
    }

    if (task?.status !== 'IN_PROGRESS' && newStatus === 'IN_PROGRESS') {
      startTimer(taskId)
    }

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const getUserById = (userId: string) => {
    return demoUsers.find(u => u.id === userId)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`
    }
    if (hours > 0) {
      return `${hours}h`
    }
    return `${mins}m`
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-700 border-red-300',
      HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
      MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
      LOW: 'bg-gray-100 text-gray-700 border-gray-300',
    }
    return colors[priority] || colors.MEDIUM
  }

  const getStatusColor = (status: Task['status']) => {
    const colors: Record<string, string> = {
      DONE: 'bg-green-100 text-green-700 border-green-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300',
      TODO: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      REVIEW: 'bg-purple-100 text-purple-700 border-purple-300',
    }
    return colors[status] || colors.TODO
  }

  const getChecklistProgress = (task: Task) => {
    if (!task.checklist || task.checklist.length === 0) return 0
    const completed = task.checklist.filter((item: ChecklistItem) => item.completed).length
    return (completed / task.checklist.length) * 100
  }

  const columns = [
    { id: 'todo', title: 'To Do', status: 'TODO' },
    { id: 'in-progress', title: 'In Progress', status: 'IN_PROGRESS' },
    { id: 'review', title: 'Review', status: 'REVIEW' },
    { id: 'done', title: 'Done', status: 'DONE' },
  ]

  const getColumnTasks = (columnId: string) => {
    return tasks.filter((task: Task) =>
      task.status === columns.find((c: { id: string }) => c.id === columnId)?.status
    )
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t: Task) => t.status === 'DONE').length
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'IN_PROGRESS').length
  const totalActualHours = tasks.reduce((sum, t: Task) => sum + t.actualHours, 0)
  const totalEstimatedHours = tasks.reduce((sum, t: Task) => sum + t.estimatedHours, 0)
  const onTrackTasks = tasks.filter((t: Task) => t.actualHours <= t.estimatedHours).length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Workshop Dashboard</span>
              </Link>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-4 mb-6 md:grid-cols-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Tasks</span>
              </div>
              <div className="text-3xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{inProgressTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Logged Hours</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{totalActualHours.toFixed(1)}h</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">On Track</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{onTrackTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Overdue</span>
              </div>
              <div className="text-3xl font-bold text-red-600">
                {tasks.filter((t: Task) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="time-tracking">Time Log</TabsTrigger>
          </TabsList>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((column) => (
                <Card key={column.id} className="min-h-[500px]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{column.title}</CardTitle>
                      <Badge variant="outline">{getColumnTasks(column.id).length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-3">
                    {getColumnTasks(column.id).map((task: Task) => (
                      <div
                        key={task.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${getPriorityColor(task.priority)}`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
                        </div>

                        {task.status === 'IN_PROGRESS' && activeTimers[task.id] && (
                          <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/30 mb-3">
                            <Timer className="h-4 w-4 text-blue-600 animate-pulse" />
                            <span className="text-sm font-mono font-semibold text-blue-600">
                              {formatDuration(activeTimers[task.id].elapsed * 60)}
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="ml-auto"
                              onClick={(e) => {
                                e.stopPropagation()
                                stopTimer(task.id)
                              }}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {task.assignedTo && getUserById(task.assignedTo) && (
                              <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                  {getUserById(task.assignedTo)?.name.charAt(0)}
                                </div>
                                <span>{getUserById(task.assignedTo)?.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right font-medium">
                            {task.actualHours}h / {task.estimatedHours}h
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          {task.status === 'TODO' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(task.id, 'IN_PROGRESS')
                              }}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              Start
                            </Button>
                          )}
                          {task.status === 'IN_PROGRESS' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(task.id, 'REVIEW')
                              }}
                            >
                              Review
                            </Button>
                          )}
                          {task.status === 'REVIEW' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(task.id, 'DONE')
                              }}
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {tasks.map((task: Task) => (
                    <div
                      key={task.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            <h4 className="font-semibold">{task.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div>{task.actualHours}h / {task.estimatedHours}h</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-tracking">
            <Card>
              <CardHeader>
                <CardTitle>Time Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Time tracking entries will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTask.title}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
                <Badge className={getStatusColor(selectedTask.status)}>{selectedTask.status}</Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Assigned To</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {getUserById(selectedTask.assignedTo)?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{getUserById(selectedTask.assignedTo)?.name}</div>
                      <div className="text-xs text-muted-foreground">{getUserById(selectedTask.assignedTo)?.role}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Due Date</h3>
                  <div className="text-lg font-semibold">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Time Tracking</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Estimated:</span>
                    <span className="ml-2 font-semibold">{selectedTask.estimatedHours}h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual:</span>
                    <span className={`ml-2 font-semibold ${selectedTask.actualHours > selectedTask.estimatedHours ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedTask.actualHours.toFixed(1)}h
                    </span>
                  </div>
                </div>
                {selectedTask.actualHours > 0 && selectedTask.estimatedHours > 0 && (
                  <Progress
                    value={Math.min((selectedTask.actualHours / selectedTask.estimatedHours) * 100, 100)}
                    className="mt-3 h-2"
                  />
                )}
              </div>

              {selectedTask.checklist.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Checklist ({selectedTask.checklist.filter((c) => c.completed).length}/{selectedTask.checklist.length})
                  </h3>
                  <Progress value={getChecklistProgress(selectedTask)} className="mb-3 h-2" />
                  <div className="space-y-2">
                    {selectedTask.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                          {item.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                {selectedTask.status === 'TODO' && (
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusChange(selectedTask.id, 'IN_PROGRESS')}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Task
                  </Button>
                )}
                {selectedTask.status === 'IN_PROGRESS' && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedTask.id, 'REVIEW')}
                    >
                      Submit for Review
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => stopTimer(selectedTask.id)}
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Stop Timer
                    </Button>
                  </>
                )}
                {selectedTask.status === 'REVIEW' && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedTask.id, 'DONE')}
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedTask.id, 'TODO')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selectedTask.status === 'DONE' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(selectedTask.id, 'TODO')}
                  >
                    Reopen Task
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
