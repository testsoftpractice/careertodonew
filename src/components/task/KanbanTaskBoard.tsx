'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  Filter,
  Search,
  ChevronDown,
  X,
  Save,
  View,
} from 'lucide-react'
import TaskEditModal from './TaskEditModal'
import { toast } from '@/hooks/use-toast'

interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  assignees: any[]
  comments?: any[]
  subtasks: any[]
  attachments: any[]
  createdAt?: string
  updatedAt?: string
}

interface Column {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  color: string
  bgColor: string
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove?: (taskId: string, newStatus: string) => void
  onTaskUpdate?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}

export default function KanbanTaskBoard({ tasks, onTaskMove, onTaskUpdate, onTaskDelete }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const columns: Column[] = [
    { id: 'TODO', title: 'To Do', status: 'TODO', color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-50' },
    { id: 'IN_PROGRESS', title: 'In Progress', status: 'IN_PROGRESS', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50' },
    { id: 'REVIEW', title: 'Review', status: 'REVIEW', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50' },
    { id: 'DONE', title: 'Done', status: 'DONE', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50' },
  ]

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'LOW': return 'bg-green-500/10 text-green-500 border-green-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer?.setData('text/plain', taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask, status)
      toast({
        title: 'Task Moved',
        description: `Task moved to ${status.replace('_', ' ')}`,
      })
    }
    setDraggedTask(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
    }
  }

  const handleTaskDelete = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId)
      setSelectedTask(null)
    }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={handleDragEnd}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-grab border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 ${
        draggedTask === task.id ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base line-clamp-2">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingTask(task)
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-500' : ''}`}>
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              <span>{task.attachments.length}</span>
            </div>
          )}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center gap-1 pt-3 border-t border-slate-100 dark:border-slate-700">
            {task.assignees.slice(0, 3).map((assignee: any, index) => (
              <div
                key={assignee.id}
                className="relative -ml-2 first:ml-0"
                title={assignee.name}
              >
                <Avatar className="h-7 w-7 border-2 border-white dark:border-slate-800">
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {assignee.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedTask(task)
            }}
            className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm text-muted-foreground"
            title="View Details"
          >
            <View className="h-4 w-4" />
            <span>Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingTask(task)
            }}
            className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm text-muted-foreground"
            title="Edit Task"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Task Board</h2>
          <p className="text-muted-foreground">
            Drag and drop tasks to organize your work
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64 text-sm bg-white/50 dark:bg-slate-800/50"
            />
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {columns.map((column) => (
          <Card
            key={column.id}
            className="flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <CardHeader className={`bg-gradient-to-r ${column.color} text-white py-3 px-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white/30 animate-pulse"></div>
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    {column.title}
                  </CardTitle>
                </div>
                <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
            </CardHeader>
            <CardContent className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px] max-h-[700px] ${column.bgColor}`}>
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 dark:bg-slate-700/20 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No tasks in {column.title.toLowerCase()}
                  </p>
                </div>
              ) : (
                getTasksByStatus(column.id).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-2 rounded-xl">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Task Details</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">{selectedTask.title}</h4>
                  <p className="text-muted-foreground">{selectedTask.description || 'No description'}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <Badge variant="outline" className={`text-sm ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant="outline" className="text-sm">
                      {selectedTask.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(selectedTask.createdAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Assignees ({selectedTask.assignees.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.assignees.map((assignee: any) => (
                        <div key={assignee.id} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={assignee.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {assignee.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{assignee.name}</div>
                            <div className="text-sm text-muted-foreground">{assignee.role || 'Team Member'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Subtasks ({selectedTask.subtasks.filter((st: any) => st.completed).length}/{selectedTask.subtasks.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((subtask: any) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            subtask.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {subtask.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {subtask.title}
                            </div>
                            {subtask.description && (
                              <div className="text-sm text-muted-foreground">{subtask.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      Attachments ({selectedTask.attachments.length})
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {selectedTask.attachments.map((attachment: any) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-2 rounded-lg">
                            <Paperclip className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{attachment.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.comments && selectedTask.comments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Comments ({selectedTask.comments.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedTask.comments.map((comment: any) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user?.avatar} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {comment.user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-sm">{comment.user?.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm">{comment.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTask(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingTask(selectedTask)
                      setSelectedTask(null)
                    }}
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Task
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleTaskDelete(selectedTask.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          users={[]}
          onClose={() => setEditingTask(null)}
          onSave={handleTaskUpdate}
        />
      )}
    </div>
  )
}
