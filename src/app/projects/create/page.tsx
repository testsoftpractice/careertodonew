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
  "Database Design", "UI/UX Design", "Project Management", "Communication",
  "Leadership", "Data Analysis", "Machine Learning", "DevOps", "Testing",
  "Git", "Agile", "Scrum", "Research", "Content Writing", "Marketing",
  "Sales", "Finance", "Accounting", "Business Development"
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

export default function CreateProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [projectData, setProjectData] = useState({
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

  const totalSteps = 5

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
    if (!projectData.title.trim()) {
      toast({ title: "Validation Error", description: "Project title is required", variant: "destructive" })
      return false
    }
    if (!projectData.description.trim()) {
      toast({ title: "Validation Error", description: "Project description is required", variant: "destructive" })
      return false
    }
    if (!projectData.category) {
      toast({ title: "Validation Error", description: "Please select a category", variant: "destructive" })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!projectData.startDate) {
      toast({ title: "Validation Error", description: "Start date is required", variant: "destructive" })
      return false
    }
    if (!projectData.teamSizeMin || !projectData.teamSizeMax) {
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
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectData.title,
          description: projectData.description,
          category: projectData.category,
          ownerId: user?.id,
          seekingInvestment: projectData.seekingInvestment,
          investmentGoal: projectData.investmentGoal ? parseFloat(projectData.investmentGoal) : null,
          startDate: projectData.startDate,
          endDate: projectData.endDate || null,
          teamSizeMin: parseInt(projectData.teamSizeMin),
          teamSizeMax: parseInt(projectData.teamSizeMax),
          budget: projectData.budget ? parseFloat(projectData.budget) : null,
          roles: roles,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Project created successfully! It will be published after review.",
        })
        router.push(`/projects/${data.data.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create project",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Create project error:", err)
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
      1: "Project Basics",
      2: "Team & Resource Planning",
      3: "Define Roles & Responsibilities",
      4: "HR & Leadership Setup",
      5: "Review & Publish",
    }
    return titles[step as keyof typeof titles] || "Create Project"
  }

  const getStepDescription = () => {
    const descriptions = {
      1: "Start by providing basic information about your project idea",
      2: "Define your team structure and resource requirements",
      3: "Specify the roles you need, their responsibilities, and required skills",
      4: "Set up leadership and HR management for your project",
      5: "Review all details before publishing your project",
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
              <span className="font-bold text-xl">Create Project</span>
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
                    {step === 5 && <Sparkles className="w-5 h-5 text-primary" />}
                    {getStepTitle()}
                  </CardTitle>
                  <CardDescription className="mt-2">{getStepDescription()}</CardDescription>
                </div>
                <Badge variant={step === 5 ? "default" : "outline"}>
                  Step {step} of {totalSteps}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Project Basics */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., AI-Powered Student Success Platform"
                        value={projectData.title}
                        onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project, its goals, target audience, and expected impact..."
                        rows={6}
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={projectData.category}
                        onValueChange={(value) => setProjectData({ ...projectData, category: value })}
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
                        <Target className="w-4 h-4" />
                        Investment (Optional)
                      </h4>
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          type="button"
                          variant={projectData.seekingInvestment ? "default" : "outline"}
                          onClick={() => setProjectData({ ...projectData, seekingInvestment: !projectData.seekingInvestment })}
                        >
                          {projectData.seekingInvestment ? "✓ Seeking Investment" : "Not Seeking Investment"}
                        </Button>
                      </div>
                      {projectData.seekingInvestment && (
                        <div className="space-y-2">
                          <Label htmlFor="investmentGoal">Investment Goal Amount ($) *</Label>
                          <Input
                            id="investmentGoal"
                            type="number"
                            placeholder="e.g., 50000"
                            value={projectData.investmentGoal}
                            onChange={(e) => setProjectData({ ...projectData, investmentGoal: e.target.value })}
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
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={projectData.startDate}
                          onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={projectData.endDate}
                          onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                          disabled={loading}
                          min={projectData.startDate}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Size Requirements
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="teamSizeMin">Minimum Team Size *</Label>
                          <Input
                            id="teamSizeMin"
                            type="number"
                            min="1"
                            placeholder="e.g., 3"
                            value={projectData.teamSizeMin}
                            onChange={(e) => setProjectData({ ...projectData, teamSizeMin: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teamSizeMax">Maximum Team Size *</Label>
                          <Input
                            id="teamSizeMax"
                            type="number"
                            min="1"
                            placeholder="e.g., 10"
                            value={projectData.teamSizeMax}
                            onChange={(e) => setProjectData({ ...projectData, teamSizeMax: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Define the optimal team size range for your project. This helps in resource planning and recruitment.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Budget Planning (Optional)
                      </h4>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Total Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          min="0"
                          placeholder="e.g., 25000"
                          value={projectData.budget}
                          onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                          disabled={loading}
                        />
                        <p className="text-sm text-muted-foreground">
                          Include estimated costs for tools, resources, and team compensation if applicable.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Define Roles & Responsibilities */}
                {step === 3 && (
                  <div className="space-y-8">
                    {/* Role Creator */}
                    <div className="p-6 border-2 border-dashed rounded-lg space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Role
                      </h4>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="roleTitle">Role Title *</Label>
                          <Input
                            id="roleTitle"
                            placeholder="e.g., Full Stack Developer"
                            value={currentRole.title}
                            onChange={(e) => setCurrentRole({ ...currentRole, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="positionsNeeded">Positions Needed *</Label>
                          <Input
                            id="positionsNeeded"
                            type="number"
                            min="1"
                            value={currentRole.positionsNeeded}
                            onChange={(e) => setCurrentRole({ ...currentRole, positionsNeeded: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Experience Level</Label>
                        <Select
                          value={currentRole.experienceLevel}
                          onValueChange={(value) => setCurrentRole({ ...currentRole, experienceLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Responsibilities</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a responsibility..."
                            value={newResponsibility}
                            onChange={(e) => setNewResponsibility(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
                          />
                          <Button type="button" variant="outline" onClick={handleAddResponsibility}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentRole.responsibilities?.map((resp, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {resp}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleRemoveResponsibility(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Required Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a required skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                          />
                          <Button type="button" variant="outline" onClick={handleAddSkill}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentRole.requiredSkills?.map((skill) => (
                            <Badge key={skill} variant="default" className="flex items-center gap-1">
                              {skill}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleRemoveSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-2">Popular skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {skillSuggestions.slice(0, 10).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10"
                                onClick={() => {
                                  if (!currentRole.requiredSkills?.includes(skill)) {
                                    setCurrentRole({
                                      ...currentRole,
                                      requiredSkills: [...(currentRole.requiredSkills || []), skill],
                                    })
                                  }
                                }}
                              >
                                + {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleAddRole}
                        disabled={!currentRole.title || !currentRole.positionsNeeded}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Role
                      </Button>
                    </div>

                    {/* Added Roles */}
                    {roles.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Roles to Fill ({roles.length})
                        </h4>
                        <div className="space-y-3">
                          {roles.map((role) => (
                            <div key={role.id} className="p-4 border rounded-lg space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-lg">{role.title}</h5>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">{role.positionsNeeded} position(s)</Badge>
                                    <Badge variant="secondary">
                                      {experienceLevels.find((l) => l.value === role.experienceLevel)?.label}
                                    </Badge>
                                  </div>
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

                              {role.responsibilities.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-1">Responsibilities:</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {role.responsibilities.map((resp, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />
                                        {resp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {role.requiredSkills.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-2">Required Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {role.requiredSkills.map((skill) => (
                                      <Badge key={skill} variant="outline">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: HR & Leadership Setup */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Project Leadership
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        The project lead is responsible for overall project execution and success.
                      </p>
                      <div className="space-y-2">
                        <Label>Project Lead</Label>
                        <Input value={user?.name || "Current User"} disabled className="bg-muted/50" />
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 bg-muted/50 border border-muted-200 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        HR Management (Optional)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Designate an HR lead to handle team coordination, conflict resolution, and recruitment.
                        This can be assigned later if needed.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="hrLead">HR Lead (Optional)</Label>
                        <Input
                          id="hrLead"
                          placeholder="Enter name or email of HR lead"
                          disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave blank if you don't have an HR lead yet. You can assign one later.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-800 dark:text-green-200">
                        <CheckCircle2 className="w-4 h-4" />
                        Ready to Publish
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Once published, your project will be visible to students who can apply for specific roles.
                        All applications will be reviewed before team members are accepted.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Publish */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg">{projectData.title}</h4>
                        <Badge variant="outline" className="mt-2">
                          {categories.find((c) => c.value === projectData.category)?.label}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-1">Description</p>
                        <p className="text-sm text-muted-foreground">{projectData.description}</p>
                      </div>

                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4" />
                            Timeline
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Start: {projectData.startDate || "TBD"}
                            {projectData.endDate && ` • End: ${projectData.endDate}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4" />
                            Team Size
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {projectData.teamSizeMin} - {projectData.teamSizeMax} members
                          </p>
                        </div>
                      </div>

                      {projectData.budget && (
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4" />
                            Budget
                          </p>
                          <p className="text-sm text-muted-foreground">${parseInt(projectData.budget).toLocaleString()}</p>
                        </div>
                      )}

                      {projectData.seekingInvestment && (
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4" />
                            Investment
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Seeking ${parseInt(projectData.investmentGoal || "0").toLocaleString()}
                          </p>
                        </div>
                      )}

                      <Separator />

                      <div>
                        <p className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <GraduationCap className="w-4 h-4" />
                          Roles & Requirements ({roles.length} roles)
                        </p>
                        <div className="space-y-3">
                          {roles.map((role) => (
                            <div key={role.id} className="p-3 border rounded-lg bg-muted/30">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{role.title}</p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">{role.positionsNeeded} pos.</Badge>
                                    <Badge variant="secondary">
                                      {experienceLevels.find((l) => l.value === role.experienceLevel)?.label?.split(" ")[0]}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              {role.requiredSkills.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground mb-1">Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {role.requiredSkills.map((skill) => (
                                      <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-800 dark:text-green-200">
                        <Sparkles className="w-4 h-4" />
                        Publishing Your Project
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your project will be published and visible to all users</li>
                        <li>• Students can browse and show interest in specific roles</li>
                        <li>• You'll receive notifications for all role applications</li>
                        <li>• You can review and approve team members</li>
                        <li>• Project progress and team performance will be tracked</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={loading || step === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/student")}>
                      Cancel
                    </Button>

                    {step < totalSteps && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (step === 1 && validateStep1()) setStep(step + 1)
                          else if (step === 2 && validateStep2()) setStep(step + 1)
                          else if (step === 3 && validateStep3()) setStep(step + 1)
                          else setStep(step + 1)
                        }}
                        disabled={loading}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                    {step === totalSteps && (
                      <Button type="submit" disabled={loading || roles.length === 0}>
                        {loading ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Publish Project
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Project Planning Tips
                </h4>
                <p className="text-sm text-muted-foreground">
                  Clearly define your project goals and requirements to attract the right team members.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Role Best Practices
                </h4>
                <p className="text-sm text-muted-foreground">
                  Be specific about responsibilities and required skills to ensure good matches.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Team Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once published, you can review applications and build your ideal team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
