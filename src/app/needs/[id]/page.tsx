'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface NeedData {
  id: string
  title: string
  description: string
  category: string
  urgency: string
  budget: number
  skills: string[]
  duration?: string
  deadline?: string
  projectId?: string
  createdAt: string
  postedBy?: {
    id: string
    name: string
    email: string
  }
}

export default function NeedDetailPage() {
  const params = useParams()
  const needId = params.id as string

  const [need, setNeed] = useState<NeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  // Fetch need details
  useEffect(() => {
    const fetchNeed = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/needs/${needId}`)
        const data = await response.json()

        if (data.success) {
          setNeed(data.data.need)
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch need details',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch need error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch need details',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (needId) {
      fetchNeed()
    }
  }, [needId])

  // Get urgency badge variant
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

  // Handle apply
  const handleApply = async () => {
    try {
      setApplying(true)
      const response = await fetch(`/api/needs/${needId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Application submitted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit application',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Apply error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive'
      })
    } finally {
      setApplying(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading need details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Need not found
  if (!need) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Need Not Found</h3>
                <p className="text-muted-foreground mb-6">The need you're looking for doesn't exist.</p>
                <Button asChild>
                  <Link href="/needs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Needs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/needs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ClipboardList className="h-5 w-5 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Need Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Details Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl">{need.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {need.description}
                  </CardDescription>
                </div>
                <Badge variant={getUrgencyVariant(need.urgency)} className="gap-1 whitespace-nowrap">
                  <AlertTriangle className="h-4 w-4" />
                  {need.urgency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills */}
              <div>
                <div className="text-sm font-medium mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {need.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Badge variant="outline">{need.category}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{need.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-medium">${need.budget.toLocaleString()}</div>
                  </div>
                </div>

                {need.duration && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-medium">{need.duration}</div>
                    </div>
                  </div>
                )}

                {need.deadline && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Deadline</div>
                      <div className="font-medium">
                        {new Date(need.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Posted By */}
              {need.postedBy && (
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-3">Posted By</div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {need.postedBy.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{need.postedBy.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{need.postedBy.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Link */}
              {need.projectId && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Linked Project</div>
                      <div className="font-medium">Project #{need.projectId}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/projects/${need.projectId}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div className="text-sm text-muted-foreground">
                Posted on {new Date(need.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button onClick={handleApply} disabled={applying} className="flex-1">
                  {applying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Apply for Need
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Needs */}
          <Card>
            <CardHeader>
              <CardTitle>Explore More Needs</CardTitle>
              <CardDescription>Check out other project needs on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/needs">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  View All Needs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
