'use client'

import { ProjectStage } from '@/lib/models/project-lifecycle'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock, Pause, XCircle, Archive } from 'lucide-react'

interface ProjectStageCardProps {
  stage: ProjectStage
  title: string
  description: string
  isActive: boolean
  projectCount?: number
  actionText?: string
  onClick?: () => void
}

export function ProjectStageCard({ stage, title, description, isActive, projectCount, actionText, onClick }: ProjectStageCardProps) {
  const getStageIcon = () => {
    switch (stage) {
      case ProjectStage.IDEA:
      return <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
      case ProjectStage.DRAFT:
        return <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
      case ProjectStage.PROPOSED:
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
      case ProjectStage.UNDER_REVIEW:
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
      case ProjectStage.APPROVED:
        return <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
      case ProjectStage.RECRUITING:
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
      case ProjectStage.ACTIVE:
        return <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
      case ProjectStage.PAUSED:
        return <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
      case ProjectStage.COMPLETED:
        return <Archive className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
      case ProjectStage.ARCHIVED:
        return <Archive className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
      default:
        return <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
    }
  }

  const getStageColor = () => {
    switch (stage) {
      case ProjectStage.IDEA:
      return 'bg-blue-50 border-blue-200 text-blue-700'
      case ProjectStage.DRAFT:
        return 'bg-orange-50 border-orange-200 text-orange-700'
      case ProjectStage.PROPOSED:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case ProjectStage.UNDER_REVIEW:
        return 'bg-amber-50 border-amber-200 text-amber-700'
      case ProjectStage.APPROVED:
        return 'bg-green-50 border-green-200 text-green-700'
      case ProjectStage.RECRUITING:
        return 'bg-purple-50 border-purple-200 text-purple-700'
      case ProjectStage.ACTIVE:
        return 'bg-green-100 border-green-300 text-green-800'
      case ProjectStage.PAUSED:
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case ProjectStage.COMPLETED:
        return 'bg-gray-50 border-gray-200 text-gray-700'
      case ProjectStage.ARCHIVED:
        return 'bg-gray-100 border-gray-300 text-gray-600'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className={`p-2 sm:p-3 rounded-full ${getStageColor()}`}>
              {getStageIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">{description}</p>
              {projectCount !== undefined && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs sm:text-sm font-medium">
                    {projectCount} project{projectCount === 1 ? '' : 's'}
                  </div>
                </div>
              )}
            </div>
          </div>
          {isActive && (
            <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm px-2 sm:px-3 py-1">
              Current
            </Badge>
          )}
        </div>
      </CardHeader>
      {onClick && (
        <CardContent>
          <Button onClick={onClick} className="w-full text-sm sm:text-base">
            {actionText || 'View Projects'}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
