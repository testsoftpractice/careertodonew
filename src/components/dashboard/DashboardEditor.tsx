'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Settings, GripVertical, X, Save, RotateCcw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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
  onReset: () => void
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

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const index = localWidgets.findIndex(w => w.id === widgetId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localWidgets.length) return

    const newWidgets = [...localWidgets]
    const [moved] = newWidgets.splice(index, 1)
    newWidgets.splice(newIndex, 0, moved)

    setLocalWidgets(newWidgets.map((widget, i) => ({ ...widget, order: i })))
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
    onReset()
    setLocalWidgets(config.widgets)
    setIsOpen(false)
  }

  const visibleCount = localWidgets.filter(w => w.visible).length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customize Dashboard</span>
            <Badge variant="secondary">{visibleCount} widgets visible</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Toggle widgets to show or hide them on your dashboard. Drag to reorder.
          </div>

          <Separator />

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {localWidgets.map((widget, index) => (
                <Card key={widget.id} className={widget.visible ? 'border-primary' : 'border-muted opacity-60'}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-move" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{widget.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {widget.component}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => moveWidget(widget.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => moveWidget(widget.id, 'down')}
                          disabled={index === localWidgets.length - 1}
                        >
                          ↓
                        </Button>
                        <Switch
                          checked={widget.visible}
                          onCheckedChange={() => toggleWidget(widget.id)}
                          className="data-[state=checked]:bg-primary"
                        />
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
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
