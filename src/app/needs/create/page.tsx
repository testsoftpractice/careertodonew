'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  X,
  Plus,
  ArrowRight,
  Loader2,
  ClipboardList,
  DollarSign,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function PostNeedPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    urgency: 'MEDIUM',
    budget: '',
    requiredSkills: [] as string[],
    duration: '',
    deadline: '',
    projectId: '',
  })
  const [currentSkill, setCurrentSkill] = useState('')

  const categories = ['Development', 'Design', 'Marketing', 'Data & Analytics', 'Content', 'Business']
  const urgencies = ['HIGH', 'MEDIUM', 'LOW']
  const durations = ['Less than 1 week', '1-2 weeks', '2-4 weeks', '1-3 months', '3-6 months', '6+ months']

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Add a skill
  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.requiredSkills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  // Remove a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((skill) => skill !== skillToRemove)
    }))
  }

  // Handle skill input key down
  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a need title',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a description',
        variant: 'destructive'
      })
      return false
    }
    if (formData.requiredSkills.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one required skill',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.budget || isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid budget',
        variant: 'destructive'
      })
      return false
    }
    return true
  }

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      const response = await fetch('/api/needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          urgency: formData.urgency,
          skills: formData.requiredSkills,
          budget: formData.budget ? Number(formData.budget) : null,
          projectId: formData.projectId || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Your need has been posted successfully',
        })
        // Redirect to needs list page
        setTimeout(() => {
          window.location.href = '/needs'
        }, 1500)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to post need',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Post need error:', error)
      toast({
        title: 'Error',
        description: 'Failed to post need. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Post a Project Need</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href="/needs">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  <span className="hidden sm:inline">Back to Needs</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your project need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Need Title *</Label>
                <Input
                  id="title"
                  placeholder="E.g., Frontend Developer for E-commerce Platform"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the need in detail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger id="urgency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencies.map((urg) => (
                        <SelectItem key={urg} value={urg}>
                          <div className="flex items-center gap-2">
                            {urg === 'HIGH' && <Clock className="h-4 w-4 text-red-500" />}
                            {urg === 'MEDIUM' && <Clock className="h-4 w-4 text-yellow-500" />}
                            {urg === 'LOW' && <Clock className="h-4 w-4 text-green-500" />}
                            <span>{urg}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Budget</CardTitle>
              <CardDescription>Specify required skills and budget for this need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills *</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Add a skill and press Enter or click Add"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Expected Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Optional: Link to Project */}
          <Card>
            <CardHeader>
              <CardTitle>Optional: Link to Project</CardTitle>
              <CardDescription>Connect this need to an existing project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  placeholder="Enter project ID (optional)"
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if this is not part of an existing project
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Post Need
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/needs">
                Cancel
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
