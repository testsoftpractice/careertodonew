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
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Send,
  Building2,
  Calendar,
  Heart,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface JobData {
  id: string
  title: string
  companyName: string
  description: string
  category: string
  type: string
  location: string
  salary: string
  salaryRange?: {
    min: number
    max: number
  }
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  applicationUrl?: string
  deadline?: string
  positions: number
  applications: number
  createdAt: string
  postedBy?: {
    id: string
    name: string
    email: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<JobData | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/jobs/${jobId}`)
        const data = await response.json()

        if (data.success) {
          setJob(data.data.job)
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch job details',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch job error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch job details',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  // Get job type badge variant
  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'default'
      case 'PART_TIME':
        return 'secondary'
      case 'INTERNSHIP':
        return 'outline'
      case 'CONTRACT':
        return 'default'
      case 'FREELANCE':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Handle apply
  const handleApply = async () => {
    try {
      setApplying(true)
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
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

  // Handle save
  const handleSave = () => {
    setSaved(!saved)
    toast({
      title: saved ? 'Removed from Saved' : 'Saved Job',
      description: saved ? 'Job removed from your saved list' : 'Job added to your saved list',
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Job not found
  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Job Not Found</h3>
                <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist.</p>
                <Button asChild>
                  <Link href="/jobs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs
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
              <Link href="/jobs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Briefcase className="h-5 w-5 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Job Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl sm:text-3xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">{job.companyName}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className={saved ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getTypeVariant(job.type)}>
                    {job.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">{job.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium truncate">{job.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Salary</div>
                    <div className="font-medium truncate">{job.salary}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Applications</div>
                    <div className="font-medium">{job.applications}</div>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Deadline</div>
                      <div className="font-medium text-xs sm:text-sm truncate">
                        {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About the Role</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Posted By */}
              {job.postedBy && (
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-3">Posted By</div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {job.postedBy.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{job.postedBy.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{job.postedBy.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div className="text-sm text-muted-foreground">
                Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                {job.applicationUrl ? (
                  <Button className="flex-1" asChild>
                    <Link href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply on Company Site
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={handleApply} disabled={applying} className="flex-1">
                    {applying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Explore More Opportunities</CardTitle>
              <CardDescription>Check out other job openings on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs
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
