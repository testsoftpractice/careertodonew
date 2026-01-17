'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'

export default function CreateRecordPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])

  const [formData, setFormData] = useState({
    type: 'PROJECT_ROLE',
    title: '',
    description: '',
    projectId: '',
    roleName: '',
    department: '',
    startDate: '',
    endDate: '',
  })

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        if (data.success) {
          setProjects(data.data?.projects || [])
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: formData.type,
          title: formData.title,
          description: formData.description,
          projectId: formData.projectId || null,
          roleName: formData.roleName || null,
          department: formData.department || null,
          startDate: formData.startDate || new Date().toISOString().split('T')[0],
          endDate: formData.endDate || null,
          metadata: {},
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Professional record created successfully',
        })
        router.push(`/dashboard/student`)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create record',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Create record error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while creating the record',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Create Professional Record</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/student">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Professional Record</CardTitle>
              <CardDescription>
                Document your work experience, projects, and achievements to build your verifiable professional portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Record Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROJECT_ROLE">Project Role</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      <SelectItem value="EMPLOYMENT">Employment</SelectItem>
                      <SelectItem value="VOLUNTEER">Volunteer Work</SelectItem>
                      <SelectItem value="ACHIEVEMENT">Achievement</SelectItem>
                      <SelectItem value="CERTIFICATION">Certification</SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the type of professional experience or achievement you want to record
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Developer - News Platform Project"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    A descriptive title for this record
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your role, responsibilities, achievements, and impact..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide detailed information about your experience and accomplishments
                  </p>
                </div>

                {/* Project Link (Optional) */}
                {(formData.type === 'PROJECT_ROLE' || formData.type === 'ACHIEVEMENT') && (
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Link to Project (Optional)</Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    >
                      <SelectTrigger id="projectId">
                        <SelectValue placeholder="Select a project (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No project linked</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Associate this record with a platform project
                    </p>
                  </div>
                )}

                {/* Role Name (Optional) */}
                {(formData.type === 'PROJECT_ROLE' || formData.type === 'EMPLOYMENT' || formData.type === 'INTERNSHIP') && (
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role/Position (Optional)</Label>
                    <Input
                      id="roleName"
                      placeholder="e.g., Senior Contributor, Software Engineer"
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your specific role or position title
                    </p>
                  </div>
                )}

                {/* Department (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Engineering, Marketing, Finance"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    The department or functional area
                  </p>
                </div>

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave empty if still ongoing
                    </p>
                  </div>
                </div>

                {/* Information Box */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">What happens next?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your record will be cryptographically hashed for verification</li>
                    <li>• You can request verification from project leads or supervisors</li>
                    <li>• Verified records are more valuable to employers</li>
                    <li>• All records contribute to your reputation score</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/student')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Record'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
