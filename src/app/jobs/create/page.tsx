'use client'

import { useState } from 'react'
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
  X,
  Plus,
  ArrowRight,
  Loader2,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function PostJobPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    category: 'Technology',
    type: 'FULL_TIME',
    location: '',
    salary: '',
    salaryRange: {
      min: '',
      max: ''
    },
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    applicationUrl: '',
    deadline: '',
    positions: '1',
  })
  const [currentRequirement, setCurrentRequirement] = useState('')
  const [currentResponsibility, setCurrentResponsibility] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  const categories = ['Technology', 'Product', 'Marketing', 'Data & Analytics', 'Design', 'Business']
  const types = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE']

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle salary range change
  const handleSalaryRangeChange = (field: 'min' | 'max', value: string) => {
    setFormData((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value
      }
    }))
  }

  // Add requirement
  const handleAddRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }))
      setCurrentRequirement('')
    }
  }

  // Remove requirement
  const handleRemoveRequirement = (reqToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((req) => req !== reqToRemove)
    }))
  }

  // Add responsibility
  const handleAddResponsibility = () => {
    if (currentResponsibility.trim() && !formData.responsibilities.includes(currentResponsibility.trim())) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, currentResponsibility.trim()]
      }))
      setCurrentResponsibility('')
    }
  }

  // Remove responsibility
  const handleRemoveResponsibility = (resToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((res) => res !== resToRemove)
    }))
  }

  // Add benefit
  const handleAddBenefit = () => {
    if (currentBenefit.trim() && !formData.benefits.includes(currentBenefit.trim())) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }))
      setCurrentBenefit('')
    }
  }

  // Remove benefit
  const handleRemoveBenefit = (benefitToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((benefit) => benefit !== benefitToRemove)
    }))
  }

  // Handle input key down
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a job title',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.companyName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a company name',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a job description',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.location.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a job location',
        variant: 'destructive'
      })
      return false
    }
    if (formData.requirements.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one requirement',
        variant: 'destructive'
      })
      return false
    }
    if (!formData.salary.trim() && (!formData.salaryRange.min || !formData.salaryRange.max)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a salary or salary range',
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
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employerId: user?.id,
          title: formData.title,
          companyName: formData.companyName,
          category: formData.category,
          type: formData.type,
          description: formData.description,
          location: formData.location,
          salary: formData.salary ? Number(formData.salary) : null,
          requirements: formData.requirements,
          responsibilities: formData.responsibilities,
          benefits: formData.benefits,
          positions: Number(formData.positions),
          salaryRange: formData.salaryRange.min && formData.salaryRange.max
            ? {
                min: Number(formData.salaryRange.min),
                max: Number(formData.salaryRange.max)
              }
            : null,
          deadline: formData.deadline || null,
          applicationUrl: formData.applicationUrl || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Your job has been posted successfully',
        })
        setTimeout(() => {
          window.location.href = '/jobs'
        }, 1500)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to post job',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Post job error:', error)
      toast({
        title: 'Error',
        description: 'Failed to post job. Please try again.',
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
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Post a Job</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href="/jobs">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  <span className="hidden sm:inline">Back to Jobs</span>
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
              <CardDescription>Provide the essential details about the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="E.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="E.g., Tech Corp Inc."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
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
                  <Label htmlFor="type">Employment Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="E.g., San Francisco, CA (Remote/Hybrid available)"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positions">Number of Positions</Label>
                  <Input
                    id="positions"
                    type="number"
                    min="1"
                    value={formData.positions}
                    onChange={(e) => handleInputChange('positions', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Add the qualifications and skills required for this role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement and press Enter or click Add"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddRequirement)}
                />
                <Button type="button" onClick={handleAddRequirement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(req)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
              <CardDescription>Describe what the successful candidate will be doing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a responsibility and press Enter or click Add"
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddResponsibility)}
                />
                <Button type="button" onClick={handleAddResponsibility}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.responsibilities.map((resp, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {resp}
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(resp)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
              <CardDescription>Specify the salary or salary range for this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Display Text</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary"
                    placeholder="E.g., $80,000 - $120,000/year or Competitive"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Salary Range (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={formData.salaryRange.min}
                    onChange={(e) => handleSalaryRangeChange('min', e.target.value)}
                  />
                  <span className="flex items-center text-muted-foreground">-</span>
                  <Input
                    placeholder="Max"
                    type="number"
                    value={formData.salaryRange.max}
                    onChange={(e) => handleSalaryRangeChange('max', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>List the benefits and perks offered with this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a benefit and press Enter or click Add"
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddBenefit)}
                />
                <Button type="button" onClick={handleAddBenefit}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefit)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure how candidates apply to this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="applicationUrl">External Application URL (Optional)</Label>
                <Input
                  id="applicationUrl"
                  placeholder="https://your-company.com/apply"
                  value={formData.applicationUrl}
                  onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the platform's application system
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
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/jobs">
                Cancel
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
