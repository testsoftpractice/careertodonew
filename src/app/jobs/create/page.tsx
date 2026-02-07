'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Users,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface FormData {
  title: string
  companyName: string
  description: string
  category: string
  type: string
  location: string
  salary: string
  salaryRange: {
    min: string
    max: string
  }
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  applicationUrl: string
  deadline: string
  positions: string
  // University targeting
  universityIds: string[]
  isRemote: boolean
  targetByReputation: boolean
  remoteLocations: string[]
}

const skillSuggestions = [
  "JavaScript", "TypeScript", "Python", "Java", "React", "Next.js", "Node.js",
  "Database Design", "UI/UX Design", "Project Management", "Communication",
  "Leadership", "Data Analysis", "Machine Learning", "DevOps", "Testing",
  "Git", "Agile", "Scrum", "Research", "Content Writing", "Marketing",
  "Sales", "Finance", "Accounting", "Business Development"
]

const experienceLevels = [
  { value: "ENTRY", label: "Entry Level (0-2 years)" },
  { value: "JUNIOR", label: "Junior (0-2 years)" },
  { value: "MID", label: "Mid-Level (2-5 years)" },
  { value: "SENIOR", label: "Senior (5-8 years)" },
  { value: "EXPERT", label: "Expert (8+ years)" },
  { value: "LEAD", label: "Lead (12+ years)" },
]

const categories = [
  { value: "TECHNOLOGY", label: "Technology", icon: "💻" },
  { value: "PRODUCT", label: "Product", icon: "📦" },
  { value: "MARKETING", label: "Marketing", icon: "📣" },
  { value: "DESIGN", label: "Design", icon: "🎨" },
  { value: "DATA", label: "Data & Analytics", icon: "📊" },
  { value: "BUSINESS", label: "Business", icon: "💼" },
  { value: "OTHER", label: "Other", icon: "📁" },
]

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
]

const minReputationSuggestions = [
  { value: "1", label: "1 Star & Below" },
  { value: "2", label: "2 Stars & Above" },
  { value: "3", label: "3 Stars & Above" },
  { value: "4", label: "4 Stars & Above" },
  { value: "5", label: "5 Stars & Above" },
]

export default function PostJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingUniversities, setLoadingUniversities] = useState(false)
  const [universities, setUniversities] = useState<{ id: string, name: string, code: string }[]>([])

  const [formData, setFormData] = useState<FormData>({
    title: '',
    companyName: '',
    description: '',
    category: 'TECHNOLOGY',
    type: 'FULL_TIME',
    location: '',
    salary: '',
    salaryRange: { min: '', max: '' },
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    applicationUrl: '',
    deadline: '',
    positions: '1',
    // University targeting
    universityIds: [] as string[],
    isRemote: false,
    targetByReputation: false,
    remoteLocations: [] as string[],
  })

  const [currentRequirement, setCurrentRequirement] = useState('')
  const [currentResponsibility, setCurrentResponsibility] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  // Fetch universities list
  useEffect(() => {
    const fetchUniversities = async () => {
      if (!user) return

      try {
        setLoadingUniversities(true)

        // Get user's university
        let universityId = user?.university?.id
        if (!universityId) {
          setUniversities([])
          return
        }

        const response = await fetch('/api/universities')

        if (!response.ok) {
          throw new Error('Failed to fetch universities')
        }

        const data = await response.json()

        if (data.universities) {
          setUniversities(data.universities || [])
        } else {
          throw new Error('Failed to fetch universities')
        }
      } catch (error) {
        console.error('Fetch universities error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch universities',
          variant: 'destructive',
        })
      } finally {
        setLoadingUniversities(false)
      }
    }
  }, [user])

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        variant: 'destructive',
      })
      return false
    }
    if (!formData.companyName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a company name',
        variant: 'destructive',
      })
      return false
    }
    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      })
      return false
    }
    if (!formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please select a category',
        variant: 'destructive',
      })
      return false
    }
    if (!formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Please select a job type',
        variant: 'destructive',
      })
      return false
    }
    if (!formData.location.trim()) {
      toast({
      title: 'Validation Error',
        description: 'Please enter a job location',
        variant: 'destructive',
      })
      return false
    }
    if (formData.requirements.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one requirement',
        variant: 'destructive',
      })
      return false
    }
    if (!formData.positions || parseInt(formData.positions) < 1) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid number of positions',
        variant: 'destructive',
      })
      return false
    }
    if (formData.salary && formData.salaryRange && formData.salaryRange.min && formData.salaryRange.max) {
      const min = parseFloat(formData.salaryRange.min)
      const max = parseFloat(formData.salaryRange.max)
      if (min >= max) {
        toast({
          title: 'Validation Error',
          description: 'Min salary must be less than max salary',
          variant: 'destructive',
        })
        return false
      }
    }
    return true
  }

  // Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user || !user.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to post a job',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          location: formData.location,
          salary: formData.salary || null,
          published: false,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Job posted successfully',
          variant: 'default',
        })
        setTimeout(() => {
          window.location.href = '/jobs'
        }, 1000)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to post job',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Create job error:', err)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
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
            <Link href="/dashboard/employer" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Post a Job</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employer">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide essential details about this position</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Tech Corp Inc."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe role, company culture, and what makes this opportunity exciting..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  </div>

              <div className="space-y-4">
                <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Label htmlFor="isRemote">
                      Remote Position
                    </Label>
                    <Select
                      value={formData.isRemote ? 'true' : 'false'}
                      onValueChange={(value) => handleInputChange('isRemote', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">On-site (office-based)</SelectItem>
                            <SelectItem value="true">Remote/Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA (Remote/Hybrid available)"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                    {formData.location && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, location: '' }))
                        }}
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                  <Select
                    value={formData.salary ? 'custom' : 'range'}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setFormData((prev) => ({
                          ...prev,
                          salary: '',
                          salaryRange: {
                            min: '',
                            max: '',
                          },
                        }))
                      } else if (value === 'range') {
                        setFormData((prev) => ({
                          ...prev,
                          salary: formData.salary,
                          salaryRange: {
                            min: formData.salaryRange.min,
                            max: formData.salaryRange.max,
                          },
                        }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="range">Salary Range</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.salary === 'custom' && (
                    <div className="mt-4">
                      <Input
                        placeholder="e.g., 60000"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                      />
                    </div>
                  )}

                  {formData.salary === 'range' && formData.salaryRange.min && formData.salaryRange.max && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">Min Salary ($/yr)</Label>
                        <Input
                          id="salaryMin"
                          type="number"
                          placeholder="e.g., 45000"
                          value={formData.salaryRange.min}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax">Max Salary ($/yr)</Label>
                        <Input
                          id="salaryMax"
                          type="number"
                          placeholder="e.g., 120000"
                          value={formData.salaryRange.max}
                          onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {formData.salary === 'range' && !formData.salaryRange.max && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData((prev) => ({ ...prev, salary: '', salaryRange: { min: '', max: '' } }))}
                    >
                      Reset Salary Range
                    </Button>
                  )}
            </div>
          </div>
          </CardContent>
        </Card>

            {/* University Targeting Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  University Targeting
                </CardTitle>
                <CardDescription>
                  {formData.isRemote
                    ? <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Remote/Hybrid Position</span>
                      </span>
                    : 'Target specific universities and reach the best candidates'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="targetByReputation">
                    Targeting Strategy
                  </Label>
                  <Select
                    value={formData.targetByReputation ? 'true' : 'false'}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, targetByReputation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="true">
                              ✅ Target by Reputation
                            </SelectItem>
                            <SelectItem value="false">Specific University</SelectItem>
                            <SelectItem value="range">By Reputation Range</SelectItem>
                            <SelectItem value="1">1 Star & Below</SelectItem>
                            <SelectItem value="2">2 Stars & Above</SelectItem>
                            <SelectItem value="3">3 Stars & Above</SelectItem>
                            <SelectItem value="4">4 Stars & Above</SelectItem>
                            <SelectItem value="5">5 Stars & Above</SelectItem>
                          </SelectContent>
                        </Select>

                {formData.targetByReputation === 'range' && (
                  <div className="mt-4">
                    <div className="grid grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Badge key="1" variant="outline">1 Star</Badge>
                        <Badge key="2" variant="outline">2 Stars</Badge>
                        <Badge key="3" variant="outline">3 Stars</Badge>
                        <Badge key="4" variant="outline">4 Stars</Badge>
                        <Badge key="5" variant="outline">5 Stars</Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Label htmlFor="remoteLocations">
                    Select multiple universities
                  </Label>
                  <Select
                    multiple={true}
                    value={formData.remoteLocations}
                    onValueChange={(value) => handleInputChange('remoteLocations', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                          <SelectContent>
                            {universities.map((uni) => (
                              <SelectItem key={uni.id} value={uni.id}>
                                {uni.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    const selected = universities.filter((uni) => formData.remoteLocations.includes(uni.id))
                    setFormData((prev) => ({ ...prev, remoteLocations: selected.length > 0 ? selected : [] }))
                  }}
                >
                  Clear Selection
                </Button>
              </div>
                </div>
            </CardContent>
          </Card>

        {/* Requirements Section */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
              <CardDescription>Add qualifications and skills required for this role</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Add a requirement and press Enter or click Add"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRequirement()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddRequirement}
                  disabled={!!currentRequirement}
                >
                  <Plus className="h-4 w-4" />
                  Add
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

        {/* Responsibilities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
              <CardDescription>Describe what successful candidate will be doing</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Add a responsibility and press Enter or click Add"
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddResponsibility()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddResponsibility}
                  disabled={!!currentResponsibility}
                >
                  <Plus className="h-4 w-4" />
                  Add
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

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits & Perks</CardTitle>
              <CardDescription>List benefits and perks offered with this position</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Add a benefit and press Enter or click Add"
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddBenefit()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddBenefit}
                  disabled={!!currentBenefit}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((bene, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {bene}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(bene)}
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
                    Leave empty to use platform's application system
                  </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
              </div>

              <div className="space-y-4">
                <Label htmlFor="positions">Number of Positions *</Label>
                  <Input
                    id="positions"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.positions}
                    onChange={(e) => handleInputChange('positions', e.target.value)}
                  />
                  </div>
            </CardContent>
          </Card>
          {/* Submit Actions */}
          <div className="flex flex items-center justify-between mt-6">
            <Button
              type="button"
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
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

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/jobs">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Jobs</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
