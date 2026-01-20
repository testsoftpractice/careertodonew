'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderKanban, Plus, Eye, Users, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface BusinessProjectsWidgetProps {
  businessId: string
  projects: Array<{
    id: string
    name: string
    status: string
    _count?: {
      members: number
      tasks: number
    }
  }>
  myRole?: string
  onAddProject?: () => void
  onManageProject?: (projectId: string) => void
}

export function BusinessProjectsWidget({
  businessId,
  projects,
  myRole,
  onAddProject,
  onManageProject,
}: BusinessProjectsWidgetProps) {
  const [showAll, setShowAll] = useState(false)

  const canCreateProjects = myRole && ['OWNER', 'ADMIN', 'PROJECT_MANAGER'].includes(myRole)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-700'
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-700'
      case 'IDEA':
        return 'bg-gray-500/10 text-gray-700'
      case 'UNDER_REVIEW':
        return 'bg-yellow-500/10 text-yellow-700'
      case 'FUNDING':
        return 'bg-purple-500/10 text-purple-700'
      case 'ON_HOLD':
        return 'bg-orange-500/10 text-orange-700'
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-700'
      default:
        return 'bg-gray-500/10 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-3 w-3" />
      default:
        return null
    }
  }

  const displayProjects = showAll ? projects : projects.slice(0, 5)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-muted-foreground" />
          Projects
        </CardTitle>
        {canCreateProjects && (
          <Button size="sm" onClick={onAddProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No projects yet</p>
              {canCreateProjects && (
                <p className="text-sm mt-2">Click "New Project" to create your first project</p>
              )}
            </div>
          ) : (
            displayProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{project.name}</h4>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        {project.status.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project._count?.members || 0} Members
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {project._count?.tasks || 0} Tasks
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManageProject?.(project.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        {projects.length > 5 && !showAll && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
            >
              View All {projects.length} Projects
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
