'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  Clock,
  User,
  Plus,
  X,
  Save,
  Paperclip,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Task {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  assignees: any[]
  subtasks: any[]
  attachments: any[]
}

interface User {
  id: string
  name: string
  avatar: string
  role: string
}

interface TaskEditModalProps {
  task: Task | null
  users: User[]
  onClose: () => void
  onSave: (task: Task) => void
}

export default function TaskEditModal({ task, users, onClose, onSave }: TaskEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: '',
    status: 'TODO' as Task['status'],
  })

  const [subtasks, setSubtasks] = useState<any[]>([])
  const [attachments, setAttachments] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate || '',
        status: task.status,
      })
      setSubtasks(task.subtasks || [])
      setAttachments(task.attachments || [])
      setSelectedUsers(task.assignees?.map((a: any) => a.id) || [])
    }
  }, [task])

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Task title is required',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          assignees: selectedUsers,
          subtasks,
          attachments,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        })
        onSave(data.data)
        onClose()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Update task error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const addSubtask = () => {
    setSubtasks([...subtasks, {
      id: Date.now().toString(),
      title: 'New subtask',
      completed: false,
      description: '',
    }])
  }

  const updateSubtask = (id: string, updates: any) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, ...updates } : st))
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id))
  }

  const toggleSubtask = (id: string) => {
    const subtask = subtasks.find(st => st.id === id)
    if (subtask) {
      updateSubtask(id, { completed: !subtask.completed })
    }
  }

  const addAttachment = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '*/*'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
          setAttachments([...attachments, {
            id: Date.now().toString(),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            data: event.target?.result,
          }])
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id))
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers(selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId]
    )
  }

  if (!task) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Task</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>
              Update task details, assign team members, and manage subtasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={4}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Assignees</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="h-4 w-4"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                              {user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.role || 'Team Member'}</div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground py-4 text-center">
                        No team members available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Subtasks</Label>
                  <Button variant="outline" size="sm" onClick={addSubtask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subtask
                  </Button>
                </div>

                {subtasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No subtasks yet. Add subtasks to break down your task.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                    {subtasks.map((subtask: any, index: number) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(subtask.id)}
                          className="h-5 w-5"
                        />
                        <div className="flex-1">
                          <Input
                            value={subtask.title}
                            onChange={(e) => updateSubtask(subtask.id, { title: e.target.value })}
                            className="h-9 text-sm"
                            disabled={subtask.completed}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubtask(subtask.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Attachments</Label>
                  <Button variant="outline" size="sm" onClick={addAttachment}>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add File
                  </Button>
                </div>

                {attachments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attachments yet. Upload files to share with your team.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group"
                      >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-2 rounded-lg">
                          <Paperclip className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-1">{attachment.name}</div>
                          <div className="text-xs text-muted-foreground">{attachment.size}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttachment(attachment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
