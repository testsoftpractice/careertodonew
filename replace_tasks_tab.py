#!/usr/bin/env python3

import re

# Read project page
with open('/home/z/my-project/src/app/projects/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove old dnd-kit imports
content = re.sub(r'import.*from \'@dnd-kit/core\'[^\n]*\n', '')
content = re.sub(r'import \{ DndContext,\n    closestCenter,\n    DragOverlay,\n    DragEndEvent,\n    PointerSensor,\n    useSensor,\n    useSensors,\n    \} from \'@dnd-kit/core\'[^\n]*\n')

# Add new imports for ProfessionalKanbanBoard
imports_to_add = """import ProfessionalKanbanBoard, { Task as KanbanTask } from '@/components/task/ProfessionalKanbanBoard'
import { DndContext, closestCenter, DragOverlay, DragEndEvent, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
"""

# Insert ProfessionalKanbanBoard imports after lucide-react imports
insert_after = r'import.*from \'lucide-react\'[^\n]*\n}'

content = re.sub(insert_after, r'\n}\n', f'{n+imports_to_add')

# Remove old task handlers and add new state and handlers
# This is complex - let me just write the new content
tasks_content = """const [showTaskModal, setShowTaskModal] = useState(false)
const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)

// Kanban drag and drop handlers
const handleKanbanDragEnd = async (task: KanbanTask, newStatus: string) => {
  if (!user || task.status === newStatus) return

  try {
    const response = await authFetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        projectId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update task status failed:', response.status, errorText)
      toast({ title: 'Error', description: `Failed to update task status (${response.status})`, variant: 'destructive' })
      return
    }

    const data = await response.json()

    if (data.success) {
      toast({ title: 'Success', description: `Task moved to ${newStatus.replace('_', ' ')}` })
      // Update local state immediately for instant feedback
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t))
    } else {
      toast({ title: 'Error', description: data.error || data.message || 'Failed to update task status', variant: 'destructive' })
    }
  } catch (err) {
    console.error('Drag and drop error:', err)
    toast({ title: 'Error', description: 'Failed to update task status', variant: 'destructive' })
  }
}

const handleTaskEdit = async (taskData: any) => {
  if (!project || !editingTask) return

  try {
    setLoading(prev => ({ ...prev, update: true }))

    const payload: {
      title: taskData.title,
      description: taskData.description || null,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      projectId: editingTask.projectId || projectId,
    }

    const response = await authFetch(`/api/tasks?id=${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update task failed:', response.status, errorText)
      toast({ title: 'Error', description: `Failed to update task (${response.status})`, variant: 'destructive' })
      setLoading(prev => ({ ...prev, update: false }))
      return
    }

    const data = await response.json()

    if (data.success) {
      toast({ title: 'Success', description: 'Task updated successfully' })
      // Update local state immediately for instant feedback
      const updatedTask = { ...editingTask, ...payload }
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
      setEditingTask(null)
      setShowTaskModal(false)
    } else {
      toast({ title: 'Error', description: data.error || data.message || 'Failed to update task', variant: 'destructive' })
    }
  } catch (err) {
    console.error('Update task error:', err)
    toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' })
    throw err
  } finally {
    setLoading(prev => ({ ...prev, update: false }))
  }
}

const handleTaskDelete = async (task: KanbanTask) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  if (!user) return

  try {
    setLoading(prev => ({ ...prev, update: true }))

    const response = await authFetch(`/api/tasks/${task.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delete task failed:', response.status, errorText)
      toast({ title: 'Error', description: `Failed to delete task (${response.status})`, variant: 'destructive' })
      setLoading(prev => ({ ...prev, update: false }))
      return
    }

    const data = await response.json()

    // Update local state immediately regardless of response for instant feedback
    setTasks(tasks.filter(t => t.id !== task.id))

    if (data.success) {
      toast({ title: 'Success', description: 'Task deleted successfully' })
    } else {
      toast({ title: 'Error', description: data.error || data.message || 'Failed to delete task', variant: 'destructive' })
    }
  } catch (err) {
    console.error('Delete task error:', err)
    toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' })
  } finally {
    setLoading(prev => ({ ...prev, update: false }))
  }
}

const setEditingTask = (task: KanbanTask | null) => {
  setEditingTask(task)
  setShowTaskModal(true)
}

const setShowTaskModal = (show: boolean) => {
  setShowTaskModal(show)
}
"""

# Find the tasks tab section and replace with new content
# Pattern matches from line 928 to line 1019
tasks_section_pattern = r'{activeTab === \'tasks\' && \(.*?\n.*activeTab !== \'tasks\' && \(</Card>.*?\n.*activeTab !== \'vacancies\' && \()'
tasks_tab_match = re.search(tasks_section_pattern, re.DOTALL)
if tasks_tab_match:
    # Get the entire tasks section from Card > Card closing to before Vacancy Modal
    start = tasks_tab_match.start()
    end = tasks_tab_match.end()
    tasks_section = content[start:end]
    
    # Replace with new Kanban Board content
    new_tasks_section = """{activeTab === 'tasks' && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                  Project Tasks
                </CardTitle>
                <Button size="sm" onClick={() => setShowTaskModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            <CardDescription>
              {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <ProfessionalKanbanBoard
                tasks={tasks}
                onDragEnd={handleKanbanDragEnd}
                onTaskEdit={setEditingTask}
                onTaskDelete={handleTaskDelete}
                loading={loading.update}
                className="min-h-[600px]"
              />
            )}
          </CardContent>
        </Card>
        )}

# Replace
content = content[:tasks_tab_match.start()] + new_tasks_section + content[tasks_tab_match.end():]

# Write back to file
with open('/home/z/my-project/src/app/projects/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
    f.close()

print("Successfully replaced tasks tab with ProfessionalKanbanBoard")
