'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { GripVertical, RotateCcw, Save, X, Settings, Plus, Briefcase } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Widget Configuration
export interface DashboardWidget {
  id: string
  title: string
  component: string
  visible: boolean
  order: number
  config?: Record<string, any>
}

export interface DashboardConfig {
  role: string
  userId?: string
  layout: 'grid' | 'list'
  widgets: DashboardWidget[]
}

interface DashboardEditorProps {
  config: DashboardConfig
  onConfigChange: (config: DashboardConfig) => void
  onSave: () => void
  onReset?: () => void
}

export function DashboardEditor({
  config,
  onConfigChange,
  onSave,
  onReset,
}: DashboardEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(config.widgets)

  const toggleWidget = (widgetId: string) => {
    setLocalWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    )
  }

  const handleSave = () => {
    onConfigChange({
      ...config,
      widgets: localWidgets.map((widget, i) => ({ ...widget, order: i })),
    })
    onSave()
    setIsOpen(false)
  }

  const handleReset = () => {
    if (typeof onReset === 'function') {
      onReset()
    }
    setLocalWidgets(config.widgets)
    setIsOpen(false)
  }

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const index = localWidgets.findIndex(w => w.id === widgetId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localWidgets.length) return

    const newWidgets = [...localWidgets]
    const [moved] = newWidgets.splice(index, 1)
    newWidgets.splice(newIndex, 0, moved)
    setLocalWidgets(newWidgets)
  }

  const availableWidgets: DashboardWidget[] = [
  { id: '1', title: 'Stats Overview', component: 'StatsCard', visible: true, order: 0 },
  { id: '2', title: 'Activity Feed', component: 'ActivityList', visible: true, order: 1 },
  { id: '3', title: 'Quick Actions', component: 'QuickActions', visible: true, order: 2 },
  { id: '4', title: 'Recent Tasks', component: 'TaskCard', visible: true, order: 3 },
  { id: '5', title: 'Projects', component: 'ProjectCard', visible: true, order: 4 },
  { id: '6', title: 'Time Tracking', component: 'Card', visible: true, order: 5 },
  { id: '7', title: 'Leave Requests', component: 'Card', visible: false, order: 6 },
]

  const visibleCount = localWidgets.filter(w => w.visible).length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-2xl max-w-[95vw] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Customize Dashboard</DialogTitle>
            <Badge variant="secondary">{visibleCount} widgets visible</Badge>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Drag and drop widgets to reorder. Toggle widgets to show or hide them.
          </div>
          <Separator />

          {/* Available Widgets */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Available Widgets</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableWidgets.map((widget) => {
                  const isAdded = localWidgets.some(w => w.id === widget.id)
                  return (
                    <Card
                      key={widget.id}
                      className={isAdded ? 'opacity-50' : 'opacity-100'}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-1">
                            <div>
                              <p className="text-sm font-medium">{widget.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {isAdded ? 'Added' : 'Add'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Active Widgets */}
          <h3 className="text-sm font-medium mb-2">Active Widgets (Drag to Reorder)</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {localWidgets.map((widget, index) => (
                <Card key={widget.id} className="cursor-move">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-400 cursor-move" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate flex-1">
                            {widget.title}
                          </span>
                          <Badge variant="outline" className="flex-shrink-0">
                            {widget.component}
                          </Badge>
                        </div>
                        <Switch
                          id={`toggle-${widget.id}`}
                          checked={widget.visible}
                          onCheckedChange={() => toggleWidget(widget.id)}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveWidget(widget.id, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                          title="Move up"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveWidget(widget.id, 'down')}
                          disabled={index === localWidgets.length - 1}
                          className="h-8 w-8 p-0"
                          title="Move down"
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <Separator />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
