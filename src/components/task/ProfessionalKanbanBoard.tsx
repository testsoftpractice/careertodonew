'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MoreVertical,
  Calendar,
  User,
  Edit3,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ListTodo,
  GripVertical,
} from 'lucide-react'

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  projectId?: string | null
  assignedBy?: string
  project?: {
    id: string
    name: string
  }
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

export interface Column {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface ProfessionalKanbanBoardProps {
  tasks: Task[]
  columns?: Column[]
  onDragEnd: (task: Task, newStatus: string) => Promise<void>
  onTaskClick?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (task: Task) => void
  loading?: boolean
  className?: string
}

const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'TODO',
    icon: <CircleDot className="w-4 h-4" />,
    color: 'border-slate-300',
    bgColor: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'IN_PROGRESS',
    icon: <Clock className="w-4 h-4" />,
    color: 'border-blue-300',
    bgColor: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
  },
  {
    id: 'review',
    title: 'Review',
    status: 'REVIEW',
    icon: <ListTodo className="w-4 h-4" />,
    color: 'border-purple-300',
    bgColor: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
  },
  {
    id: 'done',
    title: 'Done',
    status: 'DONE',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'border-emerald-300',
    bgColor: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
  },
]

const getPriorityConfig = (priority: string) => {
  const configs = {
    CRITICAL: {
      color: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
      icon: <AlertTriangle className="w-3 h-3" />,
      label: 'Critical',
    },
    HIGH: {
      color: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800',
      icon: <AlertTriangle className="w-3 h-3" />,
      label: 'High',
    },
    MEDIUM: {
      color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
      icon: <CircleDot className="w-3 h-3" />,
      label: 'Medium',
    },
    LOW: {
      color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
      icon: <CircleDot className="w-3 h-3" />,
      label: 'Low',
    },
  }
  return configs[priority as keyof typeof configs] || configs.MEDIUM
}

const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return null
  const date = new Date(dueDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else if (isOverdue(dueDate)) {
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return `${diff}d overdue`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

interface TaskCardProps {
  task: Task
  onClick?: () => void
  onEdit?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  id: string
}

function TaskCard({ task, onClick, onEdit, onDelete, id }: TaskCardProps) {
  const priorityConfig = getPriorityConfig(task.priority)
  const dueDateDisplay = formatDueDate(task.dueDate)
  const overdue = isOverdue(task.dueDate)
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: !onClick && !onEdit && !onDelete,
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`group relative`}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
      ref={setNodeRef}
      {...listeners}
    >
      <Card
        className={`
          transition-all duration-200 ease-out
          hover:shadow-xl hover:-translate-y-1
          border-l-4
          ${
            task.priority === 'CRITICAL'
              ? 'border-l-red-500'
              : task.priority === 'HIGH'
              ? 'border-l-orange-500'
              : task.priority === 'MEDIUM'
              ? 'border-l-blue-500'
              : 'border-l-slate-400'
          }
          ${onClick ? 'hover:bg-accent/50 cursor-pointer' : 'cursor-grab active:cursor-grabbing'}
        `}
      >
        <CardContent className="p-4 space-y-3">
          {/* Drag Handle */}
          <div className="flex items-start justify-between">
            <div {...attributes}>
              <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 cursor-grab" />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-accent"
                  onClick={onEdit}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Title and Priority */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm leading-tight line-clamp-2 pr-1">
              {task.title}
            </h4>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${priorityConfig.color} flex items-center gap-1 w-fit`}
            >
              {priorityConfig.icon}
              {priorityConfig.label}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              {/* Due Date */}
              {dueDateDisplay && (
                <div
                  className={`
                    flex items-center gap-1 text-xs font-medium
                    ${overdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}
                  `}
                >
                  <Calendar className="w-3 h-3" />
                  {dueDateDisplay}
                </div>
              )}
            </div>

            {/* Assignee or Project */}
            {task.project ? (
              <div
                className="flex items-center gap-1 text-xs text-muted-foreground max-w-[100px] truncate"
                title={task.project.name}
              >
                <ListTodo className="w-3 h-3" />
                {task.project.name}
              </div>
            ) : task.taskAssignees && task.taskAssignees.length > 0 ? (
              <div
                className="flex items-center gap-1 text-xs text-muted-foreground max-w-[100px] truncate"
                title={task.taskAssignees.map(ta => ta.user.name).join(', ')}
              >
                <User className="w-3 h-3" />
                {task.taskAssignees.length === 1
                  ? task.taskAssignees[0].user.name
                  : `${task.taskAssignees[0].user.name} +${task.taskAssignees.length - 1}`
                }
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ProfessionalKanbanBoard({
  tasks,
  columns = defaultColumns,
  onDragEnd,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  loading = false,
  className = '',
}: ProfessionalKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const draggedTaskRef = useRef<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      draggedTaskRef.current = task
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveTask(null)
    draggedTaskRef.current = null

    if (!active || !over) return

    const task = tasks.find(t => t.id === active.id)
    const targetColumn = columns.find(c => c.id === over.id)

    if (!task || !targetColumn) return

    if (task.status !== targetColumn.status) {
      await onDragEnd(task, targetColumn.status)
    }
  }

  const getColumnTasks = (columnId: string) => {
    const column = columns.find(c => c.id === columnId)
    if (!column) return []
    return tasks.filter(t => t.status === column.status)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`w-full ${className}`}>
        {/* Column Headers - Desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 mb-4">
          {columns.map((column) => {
            const taskCount = getColumnTasks(column.id).length
            return (
              <div
                key={column.id}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border
                  bg-gradient-to-r ${column.bgColor} ${column.color}
                `}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={taskCount > 0 ? '' : 'opacity-50'}>
                    {column.icon}
                  </span>
                  {column.title}
                </div>
                <Badge
                  variant="secondary"
                  className={`
                    ml-auto text-xs font-semibold
                    ${taskCount > 0 ? 'bg-white/80 dark:bg-slate-800/80' : 'bg-muted'}
                  `}
                >
                  {taskCount}
                </Badge>
              </div>
            )
          })}
        </div>

        {/* Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {columns.map((column) => {
              const columnTasks = getColumnTasks(column.id)
              return (
                <div
                  key={column.id}
                  id={column.id}
                  className={`
                    relative min-h-[500px] rounded-2xl p-4
                    border-2 border-dashed
                    bg-gradient-to-b ${column.bgColor}
                    ${column.color}
                    transition-all duration-300
                  `}
                >
                  {/* Mobile Column Header */}
                  <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b border-current/20">
                    <div className="flex items-center gap-2">
                      {column.icon}
                      <h3 className="font-semibold text-sm">{column.title}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {/* Task List */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          id={task.id}
                          task={task}
                          onClick={() => onTaskClick?.(task)}
                          onEdit={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            onTaskEdit?.(task)
                          }}
                          onDelete={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            onTaskDelete?.(task)
                          }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Empty State */}
                    {columnTasks.length === 0 && (
                      <div
                        className={`
                          flex flex-col items-center justify-center py-8
                          text-center text-muted-foreground
                          border-2 border-dashed rounded-lg
                          opacity-50
                        `}
                      >
                        <ListTodo className="w-8 h-8 mb-2" />
                        <p className="text-xs">No tasks yet</p>
                      </div>
                    )}
                  </div>

                  {/* Column Bottom Gradient */}
                  <div
                    className={`
                      absolute bottom-0 left-0 right-0 h-20
                      bg-gradient-to-t from-black/5 dark:from-black/10 to-transparent
                      pointer-events-none rounded-b-2xl
                    `}
                  />
                </div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="transform rotate-2 scale-105">
            <TaskCard
              id={activeTask.id}
              task={activeTask}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
