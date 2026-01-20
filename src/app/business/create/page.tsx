'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Briefcase,
  Users,
  Target,
  Calendar,
  Building2,
  DollarSign,
  CheckCircle2,
  Home,
  Trash2,
  GraduationCap,
  Star,
  Sparkles,
  Clock,
  Award,
  Layers,
  Handshake,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface RoleRequirement {
  id: string
  title: string
  positionsNeeded: number
  responsibilities: string[]
  requiredSkills: string[]
  experienceLevel: string
}

const skillSuggestions = [
  "JavaScript", "TypeScript", "Python", "Java", "React", "Next.js", "Node.js",
  "Database Design", "UI/UX Design", "Business Management", "Communication",
  "Leadership", "Data Analysis", "Machine Learning", "DevOps", "Testing",
  "Git", "Agile", "Scrum", "Research", "Content Writing", "Marketing",
  "Sales", "Finance", "Accounting", "Business Development", "Entrepreneurship"
]

const experienceLevels = [
  { value: "JUNIOR", label: "Junior (0-2 years)", description: "Learning and growth focused" },
  { value: "MID", label: "Mid-Level (2-5 years)", description: "Independent contributor" },
  { value: "SENIOR", label: "Senior (5+ years)", description: "Expert level, can lead" },
  { value: "EXPERT", label: "Expert (8+ years)", description: "Industry veteran" },
]

const categories = [
  { value: "NEWS_MEDIA", label: "News & Media", icon: "📰" },
  { value: "E_COMMERCE", label: "E-Commerce", icon: "🛒" },
  { value: "STARTUP", label: "Startup", icon: "🚀" },
  { value: "CONSULTING", label: "Consulting", icon: "💼" },
  { value: "MARKETING", label: "Marketing", icon: "📣" },
  { value: "RESEARCH", label: "Research", icon: "🔬" },
  { value: "EDTECH", label: "EdTech", icon: "🎓" },
  { value: "FINTECH", label: "FinTech", icon: "💰" },
  { value: "HEALTHCARE", label: "Healthcare", icon: "🏥" },
  { value: "SUSTAINABILITY", label: "Sustainability", icon: "🌱" },
  { value: "OTHER", label: "Other", icon: "📁" },
]

export default function CreateBusinessPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [businessData, setBusinessData] = useState({
    title: "",
    description: "",
    category: "",
    seekingInvestment: false,
    investmentGoal: "",
    startDate: "",
    endDate: "",
    teamSizeMin: "",
    teamSizeMax: "",
    budget: "",
    seekingCollaborators: false,
    seekingCoFounders: false,
    timeCommitment: "",
    departmentId: "", // New: Department selection
  })

  const [roles, setRoles] = useState<RoleRequirement[]>([])
  const [currentRole, setCurrentRole] = useState<Partial<RoleRequirement>>({
    title: "",
    positionsNeeded: 1,
    responsibilities: [],
    requiredSkills: [],
    experienceLevel: "MID",
  })

  const [newResponsibility, setNewResponsibility] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const totalSteps = 6

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setCurrentRole({
        ...currentRole,
        responsibilities: [...(currentRole.responsibilities || []), newResponsibility.trim()],
      })
      setNewResponsibility("")
    }
  }

  const handleRemoveResponsibility = (index: number) => {
    setCurrentRole({
      ...currentRole,
      responsibilities: currentRole.responsibilities?.filter((_, i) => i !== index),
    })
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !currentRole.requiredSkills?.includes(newSkill.trim())) {
      setCurrentRole({
        ...currentRole,
        requiredSkills: [...(currentRole.requiredSkills || []), newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setCurrentRole({
      ...currentRole,
      requiredSkills: currentRole.requiredSkills?.filter((s) => s !== skill),
    })
  }

  const handleAddRole = () => {
    if (!currentRole.title || !currentRole.positionsNeeded) {
      toast({
        title: "Validation Error",
        description: "Please provide role title and positions needed",
        variant: "destructive",
      })
      return
    }

    setRoles([
      ...roles,
      {
        id: Date.now().toString(),
        title: currentRole.title,
        positionsNeeded: currentRole.positionsNeeded || 1,
        responsibilities: currentRole.responsibilities || [],
        requiredSkills: currentRole.requiredSkills || [],
        experienceLevel: currentRole.experienceLevel || "MID",
      },
    ])

    setCurrentRole({
      title: "",
      positionsNeeded: 1,
      responsibilities: [],
      requiredSkills: [],
      experienceLevel: "MID",
    })
  }

  const handleRemoveRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId))
  }

  const validateStep1 = () => {
    if (!businessData.title.trim()) {
      toast({ title: "Validation Error", description: "Business title is required", variant: "destructive" })
      return false
    }
    if (!businessData.description.trim()) {
      toast({ title: "Validation Error", description: "Business description is required", variant: "destructive" })
      return false
    }
    if (!businessData.category) {
      toast({ title: "Validation Error", description: "Please select a category", variant: "destructive" })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!businessData.startDate) {
      toast({ title: "Validation Error", description: "Start date is required", variant: "destructive" })
      return false
    }
    if (!businessData.teamSizeMin || !businessData.teamSizeMax) {
      toast({ title: "Validation Error", description: "Team size range is required", variant: "destructive" })
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (roles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one role with responsibilities and skills",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: businessData.title,
          description: businessData.description,
          category: businessData.category,
          businessLeadId: user?.id,
          universityId: user?.university?.id,
          seekingInvestment: businessData.seekingInvestment,
          investmentGoal: businessData.investmentGoal ? parseFloat(businessData.investmentGoal) : null,
          startDate: businessData.startDate,
          endDate: businessData.endDate || null,
          teamSizeMin: parseInt(businessData.teamSizeMin),
          teamSizeMax: parseInt(businessData.teamSizeMax),
          budget: businessData.budget ? parseFloat(businessData.budget) : null,
          seekingCollaborators: businessData.seekingCollaborators,
          seekingCoFounders: businessData.seekingCoFounders,
          timeCommitment: businessData.timeCommitment,
          roles: roles,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Business created successfully! It will be published after review. +50 points earned!",
        })
        router.push(`/businesses/${data.data.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create business",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Create business error:", err)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    const titles = {
      1: "Business Basics",
      2: "Team & Resource Planning",
      3: "Define Roles & Responsibilities",
      4: "Collaboration & Time Commitment",
      5: "Department & University Connection",
      6: "Review & Publish",
    }
    return titles[step as keyof typeof titles] || "Start Your Business"
  }

  const getStepDescription = () => {
    const descriptions = {
      1: "Start by providing basic information about your business idea",
      2: "Define your team structure and resource requirements",
      3: "Specify roles you need, their responsibilities, and required skills",
      4: "Set collaboration preferences and time commitment",
      5: "Connect with university departments for support and recognition",
      6: "Review all details before publishing your business",
    }
    return descriptions[step as keyof typeof descriptions] || ""
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Start Your Business</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/student">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const stepNum = i + 1
                  const isCurrent = step === stepNum
                  const isCompleted = step > stepNum

                  return (
                    <div key={stepNum} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground scale-110"
                              : isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                        </div>
                        <span className={`text-xs mt-2 hidden sm:block ${isCurrent ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                          {getStepTitle().split(" ")[0]}
                        </span>
                      </div>
                      {stepNum < totalSteps && (
                        <div
                          className={`h-0.5 w-8 mx-2 ${isCompleted ? "bg-primary" : "bg-muted"}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {step === 6 && <Sparkles className="w-5 h-5 text-primary" />}
                    {getStepTitle()}
                  </CardTitle>
                  <CardDescription className="mt-2">{getStepDescription()}</CardDescription>
                </div>
                <Badge variant={step === 6 ? "default" : "outline"}>
                  Step {step} of {totalSteps}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Business Basics */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Business Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., AI-Powered Student Success Platform"
                        value={businessData.title}
                        onChange={(e) => setBusinessData({ ...businessData, title: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your business, its goals, target audience, and expected impact..."
                        rows={6}
                        value={businessData.description}
                        onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={businessData.category}
                        onValueChange={(value) => setBusinessData({ ...businessData, category: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
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

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Investment (Optional)
                      </h4>
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          type="button"
                          variant={businessData.seekingInvestment ? "default" : "outline"}
                          onClick={() => setBusinessData({ ...businessData, seekingInvestment: !businessData.seekingInvestment })}
                        >
                          {businessData.seekingInvestment ? "✓ Seeking Investment" : "Not Seeking Investment"}
                        </Button>
                      </div>
                      {businessData.seekingInvestment && (
                        <div className="space-y-2">
                          <Label htmlFor="investmentGoal">Investment Goal Amount ($) *</Label>
                          <Input
                            id="investmentGoal"
                            type="number"
                            placeholder="e.g., 50000"
                            value={businessData.investmentGoal}
                            onChange={(e) => setBusinessData({ ...businessData, investmentGoal: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Team & Resource Planning */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={businessData.startDate}
                          onChange={(e) => setBusinessData({ ...businessData, startDate: e.target.value })}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={businessData.endDate}
                          onChange={(e) => setBusinessData({ ...businessData, endDate: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teamSizeMin">Min Team Size *</Label>
                        <Input
                          id="teamSizeMin"
                          type="number"
                          placeholder="e.g., 2"
                          value={businessData.teamSizeMin}
                          onChange={(e) => setBusinessData({ ...businessData, teamSizeMin: e.target.value })}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teamSizeMax">Max Team Size *</Label>
                        <Input
                          id="teamSizeMax"
                          type="number"
                          placeholder="e.g., 10"
                          value={businessData.teamSizeMax}
                          onChange={(e) => setBusinessData({ ...businessData, teamSizeMax: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget ($) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 50000"
                        value={businessData.budget}
                        onChange={(e) => setBusinessData({ ...businessData, budget: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Define Roles & Responsibilities */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <Label>Current Role Being Defined</Label>
                      <Card className="border-2">
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="roleTitle">Role Title *</Label>
                            <Input
                              id="roleTitle"
                              placeholder="e.g., Full Stack Developer"
                              value={currentRole.title}
                              onChange={(e) => setCurrentRole({ ...currentRole, title: e.target.value })}
                              disabled={loading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="positionsNeeded">Positions Needed *</Label>
                            <Input
                              id="positionsNeeded"
                              type="number"
                              min={1}
                              value={currentRole.positionsNeeded}
                              onChange={(e) => setCurrentRole({ ...currentRole, positionsNeeded: parseInt(e.target.value) })}
                              disabled={loading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experienceLevel">Experience Level *</Label>
                            <Select
                              value={currentRole.experienceLevel}
                              onValueChange={(value) => setCurrentRole({ ...currentRole, experienceLevel: value })}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    <div className="flex flex-col">
                                      <div className="font-medium">{level.label}</div>
                                      <div className="text-sm text-muted-foreground">{level.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <div>
                              <Label>Required Skills</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Add a skill"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddSkill()
                                    }
                                  }}
                                  disabled={loading}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleAddSkill}
                                  disabled={loading}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {currentRole.requiredSkills && currentRole.requiredSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {currentRole.requiredSkills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="cursor-pointer">
                                      {skill}
                                      <X
                                        className="h-3 w-3 ml-1 inline"
                                        onClick={() => handleRemoveSkill(skill)}
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              <Label>Responsibilities</Label>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="Add a responsibility"
                                    value={newResponsibility}
                                    onChange={(e) => setNewResponsibility(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddResponsibility()
                                      }
                                    }}
                                    disabled={loading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddResponsibility}
                                    disabled={loading}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {currentRole.responsibilities && currentRole.responsibilities.length > 0 && (
                                <div className="space-y-2">
                                  {currentRole.responsibilities.map((resp, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                      <span className="text-sm">{resp}</span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveResponsibility(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Roles Added ({roles.length})</h3>
                      </div>
                      <Button type="button" onClick={handleAddRole} disabled={loading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </div>

                    {roles.length > 0 && (
                      <div className="space-y-3">
                        {roles.map((role) => (
                          <Card key={role.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{role.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {role.positionsNeeded} position{role.positionsNeeded > 1 ? 's' : ''} • {role.experienceLevel}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveRole(role.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {role.responsibilities.slice(0, 3).map((resp, idx) => (
                                <Badge key={idx} variant="outline">{resp}</Badge>
                              ))}
                              {role.responsibilities.length > 3 && (
                                <Badge variant="outline">+{role.responsibilities.length - 3} more</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {role.requiredSkills.slice(0, 4).map((skill, idx) => (
                                <Badge key={idx} variant="secondary">{skill}</Badge>
                              ))}
                              {role.requiredSkills.length > 4 && (
                                <Badge variant="secondary">+{role.requiredSkills.length - 4} more</Badge>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Collaboration & Time Commitment */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Handshake className="w-5 h-5 text-blue-600" />
                        Collaboration Settings
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Find co-founders and collaborators to build your business together
                      </p>
                      <div className="flex gap-3">
                        <Button type="button" variant={businessData.seekingCollaborators ? "default" : "outline"}>
                          {businessData.seekingCollaborators ? "✓ Seeking Collaborators" : "Seeking Collaborators"}
                        </Button>
                        <Button type="button" variant={businessData.seekingCoFounders ? "default" : "outline"}>
                          {businessData.seekingCoFounders ? "✓ Seeking Co-Founders" : "Seeking Co-Founders"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="timeCommitment">Time Commitment (Hours/Week) *</Label>
                      <Input
                        id="timeCommitment"
                        placeholder="e.g., 10-20 hours/week"
                        value={businessData.timeCommitment}
                        onChange={(e) => setBusinessData({ ...businessData, timeCommitment: e.target.value })}
                        disabled={loading}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Be realistic about the time you can commit. This helps match you with the right collaborators.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Department & University Connection */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        University Connection
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your business with university departments for support, mentorship, and recognition
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">University Department</CardTitle>
                          <CardDescription>Select your primary department</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Select
                            value={businessData.category}
                            onValueChange={(value) => setBusinessData({ ...businessData, category: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EDTECH">EdTech</SelectItem>
                              <SelectItem value="FINTECH">FinTech</SelectItem>
                              <SelectItem value="MARKETING">Marketing</SelectItem>
                              <SelectItem value="CONSULTING">Consulting</SelectItem>
                              <SelectItem value="STARTUP">Startup</SelectItem>
                              <SelectItem value="RESEARCH">Research</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="mt-4 space-y-2">
                            <Badge variant="outline" className="mr-2">
                              <Award className="h-3 w-3" />
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Connect for university support and mentorship
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Business Development</CardTitle>
                          <CardDescription>Join entrepreneurship program</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <div>
                              <div className="text-sm font-medium">+100 Points</div>
                              <div className="text-xs text-muted-foreground">For university recognition</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <Layers className="w-4 h-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Exclusive Support</div>
                              <div className="text-xs text-muted-foreground">Get mentorship and resources</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Connecting your business to university departments unlocks mentorship, funding opportunities, and official recognition.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Publish */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-4">Business Summary</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-muted-foreground">Business Name:</span>
                          <span className="font-medium ml-2">{businessData.title}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium ml-2">
                            {categories.find((c) => c.value === businessData.category)?.label || businessData.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Team Size:</span>
                          <span className="font-medium ml-2">
                            {businessData.teamSizeMin} - {businessData.teamSizeMax} members
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium ml-2">
                            ${businessData.budget ? businessData.budget : 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Roles:</span>
                          <span className="font-medium ml-2">{roles.length} roles defined</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Collaboration:</span>
                          <span className="font-medium ml-2">
                            {businessData.seekingCollaborators || businessData.seekingCoFounders ? 'Seeking team members' : 'No'}
                          </span>
                        </div>
                        {businessData.seekingInvestment && (
                          <div>
                            <span className="text-muted-foreground">Investment Goal:</span>
                            <span className="font-medium ml-2">
                              ${businessData.investmentGoal}
                            </span>
                          </div>
                        )}
                        {businessData.category && (
                          <div>
                            <span className="text-muted-foreground">University Connection:</span>
                            <span className="font-medium ml-2">
                              {categories.find((c) => c.value === businessData.category)?.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-semibold">Reward System</div>
                          <div className="text-sm text-muted-foreground">Create business: +50 points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}

                  {step < totalSteps && (
                    <Button
                      type="button"
                      onClick={() => {
                        if (step === 1 && validateStep1()) setStep(2)
                        else if (step === 2 && validateStep2()) setStep(3)
                        else if (step === 3 && validateStep3()) setStep(4)
                        else if (step === 4) setStep(5)
                        else if (step === 5) setStep(6)
                      }}
                      disabled={loading}
                    >
                      {step === totalSteps ? 'Publish Business' : 'Next Step'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {step === totalSteps && (
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-t-current border-r-transparent rounded-full animate-spin mr-2" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Publish Business
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
