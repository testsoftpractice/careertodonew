'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Plus, GraduationCap, Briefcase, Calendar, Target, Info, CheckCircle2, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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
    universityId: user?.university?.id || "",
  })

  const [hrData, setHrData] = useState({
    projectLeadId: user?.id || "",
    hrLeadId: "",
  })

  const recordTypes = [
    { value: "PROJECT_ROLE", label: "Project Role", description: "Positions held in projects", icon: "💼" },
    { value: "LEADERSHIP", label: "Leadership", description: "Team lead or management roles", icon: "👥" },
    { value: "TASK_COMPLETION", label: "Task Completion", description: "Completed tasks and deliverables", icon: "✅" },
    { value: "SKILL_ACQUIRED", label: "Skill Acquired", description: "Skills developed through projects", icon: "🎓" },
    { value: "CERTIFICATION", label: "Certification", description: "Certifications and credentials", icon: "📜" },
  ]

  const categories = [
    { value: "NEWS_MEDIA", label: "News & Media", icon: "📰" },
    { value: "E_COMMERCE", label: "E-Commerce", icon: "🛒" },
    { value: "STARTUP", label: "Startup", icon: "🚀" },
    { value: "CONSULTING", label: "Consulting", icon: "💼" },
    { value: "MARKETING", label: "Marketing", icon: "📣" },
    { value: "RESEARCH", label: "Research", icon: "🔬" },
    { value: "TAX_CONSULTING", label: "Tax Consulting", icon: "📊" },
    { value: "OTHER", label: "Other", icon: "📁" },
  ]

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          projectLeadId: hrData.projectLeadId,
          hrLeadId: hrData.hrLeadId,
          universityId: projectData.universityId,
          seekingInvestment: projectData.seekingInvestment,
          investmentGoal: projectData.investmentGoal ? parseFloat(projectData.investmentGoal) : null,
          startDate: projectData.startDate || new Date().toISOString().split("T")[0],
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Project proposal submitted successfully!",
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
    if (!hrData.projectLeadId) {
      toast({ title: "Validation Error", description: "Project lead is required", variant: "destructive" })
      return false
    }
    return true
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Create Project</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Add New Project</CardTitle>
                  <CardDescription>Create a new project proposal for university approval</CardDescription>
                </div>
                <Badge variant="outline">Step {step} of 2</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Record Type</Label>
                      <p className="text-sm text-muted-foreground mb-4">Choose type of professional record you want to create</p>
                      <div className="grid grid-cols-2 gap-4">
                        {recordTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setProjectData({ ...projectData, type: type.value })}
                            disabled={loading}
                            className={`relative p-6 rounded-lg border-2 transition-all text-left ${projectData.type === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          >
                            <div className="text-4xl mb-2">{type.icon}</div>
                            <div className="font-semibold">{type.label}</div>
                            <div className="text-sm text-muted-foreground mt-1">{type.description}</div>
                            {projectData.type === type.value && <Badge className="absolute -top-2 -right-2">Selected</Badge>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Enter record title" value={projectData.title} onChange={(e) => setProjectData({ ...projectData, title: e.target.value })} disabled={loading} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe your role, responsibilities, achievements..." rows={4} value={projectData.description} onChange={(e) => setProjectData({ ...projectData, description: e.target.value })} disabled={loading} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={projectData.category} onValueChange={(value) => setProjectData({ ...projectData, category: value })} disabled={loading} required>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className="mr-2">{cat.icon}</span>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Choose category that best fits your project</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold mb-3">HR Leadership Setup</Label>
                      <p className="text-sm text-muted-foreground mb-4">Every project requires a Project Lead to oversee operations and an HR Lead to manage team building</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="projectLead">Project Lead</Label>
                        <Input id="projectLead" value={user?.name || ""} disabled className="bg-muted/50" />
                        <p className="text-xs text-muted-foreground mt-1">Cannot be modified</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hrLead">HR Lead *</Label>
                        <Input id="hrLead" value={hrData.hrLeadId} onChange={(e) => setHrData({ ...hrData, hrLeadId: e.target.value })} disabled={loading} placeholder="Select team member" required />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={loading}>Back</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/records/${user?.id}`)}>Cancel</Button>
                    {step < 2 && (
                      <Button type="button" onClick={() => { if (validateStep1()) setStep(2) }} disabled={loading}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    )}
                    {step === 2 && (
                      <Button type="submit" disabled={loading || !validateStep2()}>{loading ? "Creating..." : "Create Record"} <Plus className="ml-2 h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader><CardTitle>Need Help?</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Project Guidelines</h4>
                  <p className="text-sm text-muted-foreground">Review your university's project approval guidelines and requirements</p>
                  <Button variant="outline" size="sm" asChild><Link href="/dashboard/student">View Guidelines</Link></Button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">HR Best Practices</h4>
                  <p className="text-sm text-muted-foreground">Learn about HR-first team building and effective team management</p>
                  <Button variant="outline" size="sm" asChild><Link href="/docs/hr-best-practices">Learn More</Link></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
