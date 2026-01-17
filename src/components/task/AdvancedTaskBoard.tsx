'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskPriority, TaskStatus, getEisenhowerQuadrant, EisenhowerQuadrant } from '@/lib/models/advanced-task'
import { AlertTriangle, CheckCircle2, Circle, Clock, MoreHorizontal } from 'lucide-react'

interface TaskBoardProps {
  projectId: string
}

interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string
  dueDate?: Date
  estimatedHours?: number
  tags: string[]
  dependsOn: string[]
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL')

  // Mock tasks
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Design homepage wireframes',
      description: 'Create initial mockups for user feedback',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assignedTo: 'Sarah Johnson',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      tags: ['design', 'urgent'],
      dependsOn: [],
    },
    {
      id: '2',
      title: 'Build landing page',
      description: 'Implement responsive design with mobile-first approach',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: 'Michael Chen',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 12,
      tags: ['frontend', 'responsive'],
      dependsOn: ['1'],
    },
    {
      id: '3',
      title: 'Setup API routes',
      description: 'Create RESTful endpoints for all project data',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assignedTo: 'Emily Davis',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 16,
      tags: ['backend', 'api'],
      dependsOn: ['2'],
    },
    {
      id: '4',
      title: 'Implement user authentication',
      description: 'Add JWT-based auth with refresh tokens',
      status: TaskStatus.TODO,
      priority: TaskPriority.CRITICAL,
      assignedTo: 'James Wilson',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      estimatedHours: 20,
      tags: ['security', 'auth', 'jwt'],
      dependsOn: [],
    },
    {
      id: '5',
      title: 'Write documentation',
      description: 'Document all API endpoints and data models',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedTo: 'Sarah Johnson',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHours: 6,
      tags: ['documentation'],
      dependsOn: ['2', '3', '4'],
    },
    {
      id: '6',
      title: 'Create test cases',
      description: 'Write comprehensive unit and integration tests',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedTo: 'Michael Chen',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estimatedHours: 10,
      tags: ['testing', 'quality'],
      dependsOn: ['2', '3', '4', '5'],
    },
    {
      id: '7',
      title: 'Design database schema',
      description: 'Create Prisma schema with all models and relationships',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assignedTo: 'Emily Davis',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedHours: 4,
      tags: ['database', 'prisma'],
      dependsOn: [],
    },
    {
      id: '8',
      title: 'Setup project structure',
      description: 'Initialize Next.js project with proper folder structure',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assignedTo: 'James Wilson',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 2,
      tags: ['setup'],
      dependsOn: [],
    },
  ]

  const columns = [
    { id: 'backlog', title: 'Backlog', status: TaskStatus.BACKLOG },
    { id: 'todo', title: 'To Do', status: TaskStatus.TODO },
    { id: 'in-progress', title: 'In Progress', status: TaskStatus.IN_PROGRESS },
    { id: 'review', title: 'Review', status: TaskStatus.REVIEW },
    { id: 'done', title: 'Done', status: TaskStatus.DONE },
  ]

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true
    return task.status === columns.find(c => c.id === filter)?.status
  })

  const getColumnTasks = (columnId: string) => {
    return filteredTasks.filter(task => task.status === columns.find(c => c.id === columnId)?.status)
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return 'bg-red-100 text-red-700 border-red-300'
      case TaskPriority.HIGH:
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case TaskPriority.MEDIUM:
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case TaskPriority.LOW:
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      setTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, status } : t))
      setDraggedTask(null)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Advanced Task Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Drag-and-drop task board with dependencies and priorities
            </p>
          </div>
          <div className="flex gap-2">
            {columns.map(column => (
              <Button
                key={column.id}
                variant={filter === column.status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filter === column.status ? 'ALL' : column.status)}
                className="text-xs sm:text-sm"
              >
                {column.title}
                {column.id !== 'backlog' && (
                  <span className="ml-1 sm:ml-2">
                    {getColumnTasks(column.id).length}
                  </span>
                )}
              </Button>
            ))}
            <Button variant="default" size="sm" className="text-xs sm:text-sm">
              All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.filter(col => col.id !== 'backlog').map(column => (
            <Card
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.status as TaskStatus)}
              className="min-h-[400px]"
            >
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">{column.title}</CardTitle>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {getColumnTasks(column.id).length} tasks
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                {getColumnTasks(column.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`
                      p-2 sm:p-3 sm:p-4 border rounded-lg cursor-move
                      hover:shadow-md transition-all duration-200
                      ${getPriorityColor(task.priority)}
                    `}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-1">
                            <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Badge
                          variant={task.priority === TaskPriority.CRITICAL ? 'destructive' : 'secondary'}
                          className="text-xs whitespace-nowrap"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="ml-1">
                          {task.estimatedHours && `${task.estimatedHours}h`}
                          {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                          <Circle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="ml-1 truncate">
                            {task.assignedTo}
                          </span>
                        </div>
                      )}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {task.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {task.dependsOn.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-orange-500" />
                          <span className="text-xs sm:text-sm text-orange-500 ml-1">
                            Depends on {task.dependsOn.length} task{task.dependsOn.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 border-t pt-2 sm:pt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => handleStatusChange(task.id, TaskStatus.TODO)}
                      >
                        {task.status === TaskStatus.TODO ? 'Undo' : 'To Do'}
                      </Button>
                      {task.status === TaskStatus.TODO && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusChange(task.id, TaskStatus.IN_PROGRESS)}
                          className="flex-1"
                        >
                          Start
                        </Button>
                      )}
                      {task.status === TaskStatus.IN_PROGRESS && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusChange(task.id, TaskStatus.DONE)}
                          className="flex-1"
                        >
                          Complete
                        </Button>
                      )}
                      {task.status === TaskStatus.REVIEW && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleStatusChange(task.id, TaskStatus.DONE)}
                            className="flex-1"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(task.id, TaskStatus.TODO)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {getColumnTasks(column.id).length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <Circle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3" />
                    <p className="text-sm sm:text-base">
                      No tasks in {column.title}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Task Statistics</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                {tasks.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Tasks
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                {tasks.filter(t => t.status === TaskStatus.TODO).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                To Do
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">
                {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                In Progress
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                {tasks.filter(t => t.status === TaskStatus.DONE).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                {tasks.filter(t => t.priority === TaskPriority.CRITICAL).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Critical
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
