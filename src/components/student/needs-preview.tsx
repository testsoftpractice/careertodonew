'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowRight,
  Loader2,
  Search,
} from 'lucide-react'
import Link from 'next/link'

interface Need {
  id: string
  projectId: string
  title: string
  description: string
  category: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  skills: string[]
  budget: number | null
  createdAt: Date
}

interface NeedsPreviewProps {
  compact?: boolean
}

export function NeedsPreview({ compact = false }: NeedsPreviewProps) {
  const [needs, setNeeds] = useState<Need[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/needs?limit=5')
        const data = await response.json()

        if (data.success) {
          setNeeds(data.data.needs || [])
        }
      } catch (error) {
        console.error('Fetch needs error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNeeds()
  }, [])

  const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'default'
      case 'LOW':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return <AlertTriangle className="h-3 w-3" />
      case 'MEDIUM':
        return <Clock className="h-3 w-3" />
      case 'LOW':
        return <Clock className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Project Needs
          </CardTitle>
          <CardDescription>One-time project opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : needs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No needs available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {needs.slice(0, 3).map((need) => (
                <div
                  key={need.id}
                  className="p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm line-clamp-1 flex-1">{need.title}</h4>
                    <Badge variant={getUrgencyVariant(need.urgency)} className="text-xs shrink-0">
                      {getUrgencyIcon(need.urgency)}
                      <span className="ml-1">{need.urgency}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{need.category}</span>
                    {need.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{need.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href="/needs">
                  View All Needs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Project Needs
            </CardTitle>
            <CardDescription>
              One-time project opportunities available
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/needs">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Search Needs</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/needs/create">
                Post a Need
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : needs.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Project Needs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are no one-time project needs available at this time.
            </p>
            <Button asChild>
              <Link href="/needs/create">
                Post a Need
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {needs.map((need) => (
              <div
                key={need.id}
                className="p-4 rounded-xl border-2 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-semibold line-clamp-1 flex-1">{need.title}</h4>
                  <Badge variant={getUrgencyVariant(need.urgency)} className="shrink-0">
                    {getUrgencyIcon(need.urgency)}
                    <span className="ml-1">{need.urgency}</span>
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {need.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {need.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {need.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{need.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary" className="mr-2">{need.category}</Badge>
                    {new Date(need.createdAt).toLocaleDateString()}
                  </div>
                  {need.budget && (
                    <div className="flex items-center gap-1 font-semibold">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>{need.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href={`/projects/${need.projectId}/needs/${need.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
