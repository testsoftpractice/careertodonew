'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  CircleDot,
  ListTodo,
  X,
  Save,
  Loader2,
  Sparkles,
  Users,
  Plus,
  Trash2,
  Check,
} from 'lucide-react'
import { Task } from './ProfessionalKanbanBoard'
import TaskComments from './TaskComments'
import { authFetch } from '@/lib/api-response'

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh?: () => void
  onSave: (taskData: any, isNewTask?: boolean) => Promise<void>
  task?: Task | null
  mode?: 'create' | 'edit'
  projects?: Array<{ id: string; name: string }>
  availableUsers?: Array<{ id: string; name: string; email?: string }>
  loading?: boolean
}

interface FormData {
  title: string
  description: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  dueDate: string
  projectId: string
  assigneeIds: string[]
  subtasks: { title: string }[]
}

interface SubTaskInput {
  id: string
  title: string
}

const priorityConfig = {
  CRITICAL: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
    description: 'Urgent - requires immediate attention',
  },
  HIGH: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800',
    description: 'High priority - should be completed soon',
  },
  MEDIUM: {
    icon: <CircleDot className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    description: 'Medium priority - can be completed in due time',
  },
  LOW: {
    icon: <CircleDot className="w-4 h-4" />,
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    description: 'Low priority - can be deferred',
  },
}

const statusConfig = {
  TODO: {
    icon: <CircleDot className="w-4 h-4" />,
    label: 'To Do',
    color: 'border-slate-300',
  },
  IN_PROGRESS: {
    icon: <Clock className="w-4 h-4" />,
    label: 'In Progress',
    color: 'border-blue-300',
  },
  REVIEW: {
    icon: <ListTodo className="w-4 h-4" />,
    label: 'Review',
    color: 'border-purple-300',
  },
  DONE: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Done',
    color: 'border-emerald-300',
  },
}

export default function TaskFormDialog({
  open,
  onOpenChange,
  onSave,
  task,
  mode = 'create',
  projects = [],
  availableUsers = [],
  loading = false,
}: TaskFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    projectId: '',
    assigneeIds: [],
    subtasks: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Subtasks input state
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtasks, setSubtasks] = useState<SubTaskInput[]>([])

  useEffect(() => {
    if (open && !isInitialized) {
      // First initialization
      if (task && mode === 'edit') {
        // Fetch existing subtasks and assignees for edit mode
        const fetchTaskData = async () => {
          try {
            // Fetch subtasks
            const subtasksResponse = await authFetch(`/api/tasks/${task.id}/subtasks`)
            const subtasksData = await subtasksResponse.json()
            const loadedSubtasks = (subtasksData.subtasks || []).map((s: any) => ({
              id: s.id,
              title: s.title,
              completed: s.completed,
            }))
            setSubtasks(loadedSubtasks)

            // Fetch multiple assignees
            const assigneesResponse = await authFetch(`/api/tasks/${task.id}/assignees`)
            const assigneesData = await assigneesResponse.json()
            const loadedAssigneeIds = (assigneesData.assignees || []).map((a: any) => a.userId)
            
            // Parse task.assigneeId or task.assignedTo for backward compatibility
            const assigneeIds = [...loadedAssigneeIds]
            if (task.assigneeId || task.assignedTo) {
              const legacyAssigneeId = task.assigneeId || task.assignedTo
              if (!assigneeIds.includes(legacyAssigneeId)) {
                assigneeIds.push(legacyAssigneeId)
              }
            }
            
            const newFormData = {
              title: task.title || '',
              description: task.description || '',
              priority: task.priority || 'MEDIUM',
              status: task.status || 'TODO',
              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
              projectId: task.projectId || '',
              assigneeIds,
              subtasks: [],
            }
            setFormData(newFormData)
          } catch (error) {
            console.error('Failed to fetch task data:', error)
            // Fallback to basic task data
            const assigneeIds = []
            if (task.assigneeId || task.assignedTo) {
              assigneeIds.push(task.assigneeId || task.assignedTo)
            }
            const newFormData = {
              title: task.title || '',
              description: task.description || '',
              priority: task.priority || 'MEDIUM',
              status: task.status || 'TODO',
              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
              projectId: task.projectId || '',
              assigneeIds,
              subtasks: [],
            }
            setFormData(newFormData)
            setSubtasks([])
          }
        }
        fetchTaskData()
      } else if (!task && mode === 'create') {
        const newFormData = {
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: '',
          projectId: projects.length === 1 ? projects[0].id : '',
          assigneeIds: [],
          subtasks: [],
        }
        setFormData(newFormData)
        setSubtasks([])
      }
      setIsInitialized(true)
      setErrors({})
      setTouched({})
    } else if (!open) {
      // Reset when dialog closes
      setIsInitialized(false)
      setIsSubmitting(false)
      setSubtaskInput('')
      setSubtasks([])
    }
  }, [task, mode, open, isInitialized, projects.length === 1 && projects[0]?.id])

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (typeof value === 'string') {
      setTouched(prev => ({ ...prev, [field]: true }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters'
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Include subtasks in the form data
      const submitData = {
        ...formData,
        subtasks: subtasks,
      }
      
      await onSave(submitData)
      onOpenChange(false)
      setIsSubmitting(false)
      if (mode === 'create') {
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: '',
          projectId: '',
          assigneeIds: [],
          subtasks: [],
        })
        setSubtasks([])
        setSubtaskInput('')
      }
    } catch (error) {
      console.error('[TaskFormDialog] Error saving task:', error)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setTimeout(() => {
      setErrors({})
      setTouched({})
      setSubtaskInput('')
      setSubtasks([])
    }, 300)
  }

  // Subtask handlers
  const addSubtask = () => {
    if (!subtaskInput.trim()) return
    
    const newSubtask: SubTaskInput = {
      id: Date.now().toString(),
      title: subtaskInput.trim(),
    }
    
    setSubtasks(prev => [...prev, newSubtask])
    setSubtaskInput('')
  }

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id))
  }

  const toggleSubtaskComplete = (id: string) => {
    setSubtasks(prev => prev.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ))
  }

  // Assignee handlers
  const addAssignee = (userId: string) => {
    if (!formData.assigneeIds.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        assigneeIds: [...prev.assigneeIds, userId],
      }))
    }
  }

  const removeAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigneeIds: prev.assigneeIds.filter(id => id !== userId),
    }))
  }

  const getAvailableUsersForAssignee = () => {
    return availableUsers.filter(user => !formData.assigneeIds.includes(user.id))
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel} modal={true}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[9999] shadow-2xl bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-2 relative z-[100000]">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
              <DialogTitle className="text-2xl font-semibold">
                {mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {mode === 'create'
                ? 'Fill in the details below to create a new task. All fields marked with * are required.'
                : 'Update the task details below. Changes will be saved immediately.'}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                placeholder="Enter a clear and descriptive task title"
                className={`
                  transition-all duration-200
                  ${errors.title && touched.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  ${!errors.title && touched.title ? 'border-emerald-500 focus-visible:ring-emerald-500' : ''}
                `}
              />
              <AnimatePresence>
                {errors.title && touched.title && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {errors.title}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-xs text-muted-foreground">
                {formData.title.length} / 200 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide additional details about this task..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length} / 2000 characters
              </p>
            </div>

            <Separator />

            {/* Priority and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => {
                    handleChange('priority', value)
                    setErrors(prev => ({ ...prev, priority: undefined }))
                  }}
                  onOpenChange={(open: boolean) => {
                    if (open) {
                      setTouched(prev => ({ ...prev, priority: true }))
                    }
                  }}
                >
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100001]">
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {config.icon}
                          <span className="font-medium">{key}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {formData.priority && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      {priorityConfig[formData.priority].icon}
                      <p className="text-xs text-muted-foreground">
                        {priorityConfig[formData.priority].description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status (Edit Mode Only) */}
              {mode === 'edit' && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100001]">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <span className="font-medium">{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Multiple Assignees (For Project Tasks) */}
            {(mode === 'create' || mode === 'edit') && availableUsers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assign to <span className="text-muted- font-normal">(Optional)</span>
                  {formData.assigneeIds.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {formData.assigneeIds.length} selected
                    </Badge>
                  )}
                </Label>
                
                {/* Selected Assignees */}
                {formData.assigneeIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.assigneeIds.map((assigneeId) => {
                      const user = availableUsers.find(u => u.id === assigneeId)
                      if (!user) return null
                      return (
                        <Badge key={assigneeId} variant="secondary" className="gap-1">
                          {user.name}
                          <button
                            type="button"
                            onClick={() => removeAssignee(assigneeId)}
                            className="hover:bg-destructive/20 hover:text-destructive rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {/* Add Assignee Dropdown */}
                {getAvailableUsersForAssignee().length > 0 && (
                  <Select onValueChange={addAssignee}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="+ Add assignee" />
                    </SelectTrigger>
                    <SelectContent className="z-[100001]">
                      {getAvailableUsersForAssignee().map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.email && (
                              <span className="text-xs text-muted-foreground">
                                ({user.email})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`
                  transition-all duration-200
                  ${errors.dueDate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                `}
              />
              <AnimatePresence>
                {errors.dueDate && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {errors.dueDate}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Subtasks */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Subtasks <span className="text-muted-foreground font-normal">(Optional)</span>
                {subtasks.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {subtasks.length} items
                  </Badge>
                )}
              </Label>
              
              {/* Subtasks List */}
              {subtasks.length > 0 && (
                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <div 
                      key={subtask.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 group hover:bg-muted/80 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSubtaskComplete(subtask.id)}
                        className="flex-shrink-0"
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          subtask.completed 
                            ? 'bg-emerald-500 border-emerald-600' 
                            : 'border-muted-foreground hover:border-emerald-500'
                        }`}>
                          {subtask.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                      <Input
                        value={subtask.title}
                        onChange={(e) => {
                          const updatedSubtasks = [...subtasks]
                          updatedSubtasks[index].title = e.target.value
                          setSubtasks(updatedSubtasks)
                        }}
                        className="flex-1 min-w-0 bg-transparent border-0 focus-visible:ring-0 focus-visible:bg-transparent text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSubtask(subtask.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Subtask Input */}
              <div className="flex gap-2">
                <Input
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  placeholder="Add a subtask..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSubtask()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addSubtask}
                  variant="outline"
                  size="sm"
                  disabled={!subtaskInput.trim()}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Discussion/Comments (Edit Mode Only) */}
            {mode === 'edit' && task && (
              <>
                <Separator />
                <div className="space-y-4">
                  <TaskComments taskId={task.id} projectId={task.projectId} />
                </div>
              </>
            )}

            {/* Project (Optional) */}
            {mode === 'create' && projects.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-semibold">
                  Project <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Select
                  value={formData.projectId || 'none'}
                  onValueChange={(value) => handleChange('projectId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger id="project" className="w-full">
                    <SelectValue placeholder="No project selected" />
                  </SelectTrigger>
                  <SelectContent className="z-[100001]">
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            {/* Form Actions */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="gap-2 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'create' ? 'Create Task' : 'Save Changes'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
