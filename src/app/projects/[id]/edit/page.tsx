'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Briefcase,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Settings,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    category: "",
    status: "ACTIVE",
    seekingInvestment: false,
    investmentGoal: "",
  })

  const [hrData, setHrData] = useState({
    projectLeadId: "",
    hrLeadId: "",
  })

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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          const project = data.data
          setProjectData({
            title: project.title || "",
            description: project.description || "",
            category: project.category || "",
            status: project.status || "ACTIVE",
            seekingInvestment: project.seekingInvestment || false,
            investmentGoal: project.investmentGoal ? String(project.investmentGoal) : "",
          })
          setHrData({
            projectLeadId: project.projectLeadId || "",
            hrLeadId: project.hrLeadId || "",
          })
        }
      } catch (error) {
        console.error("Fetch project error:", error)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...projectData,
          seekingInvestment: projectData.seekingInvestment,
          investmentGoal: projectData.investmentGoal ? parseInt(projectData.investmentGoal) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Project updated successfully!",
        })
        router.push(`/projects/${params.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update project",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Update project error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
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
            <Link href={`/projects/${params.id}`} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-bold text-xl">Edit Project</span>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Project</h1>
              <p className="text-muted-foreground">
                Update project information and settings
              </p>
            </div>
            <Badge variant="outline">{params.id}</Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update project title, description, and category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={projectData.title}
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={projectData.category}
                    onValueChange={(value) => setProjectData({ ...projectData, category: value })}
                    disabled={loading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Project Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={projectData.status}
                  onValueChange={(value) => setProjectData({ ...projectData, status: value })}
                  disabled={loading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                Active: Visible to team and marketplace | On Hold: Temporarily suspended | Completed: Successfully finished | Canceled: Terminated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Investment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="seekingInvestment"
                  checked={projectData.seekingInvestment}
                  onChange={(e) => setProjectData({ ...projectData, seekingInvestment: e.target.checked })}
                  disabled={loading}
                  className="mt-1 h-4 w-4"
                />
                <div className="flex-1">
                  <Label htmlFor="seekingInvestment" className="text-base font-semibold">
                    Enable Investment Seeking
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow investors to view this project and express investment interest in marketplace
                  </p>
                </div>
              </div>

              {projectData.seekingInvestment && (
                <div className="space-y-2">
                  <Label htmlFor="investmentGoal">Investment Goal (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="investmentGoal"
                      type="number"
                      placeholder="e.g., 100000"
                      value={projectData.investmentGoal}
                      onChange={(e) => setProjectData({ ...projectData, investmentGoal: e.target.value })}
                      disabled={loading}
                      className="pl-10"
                      min={1000}
                      step={1000}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum $1,000. This amount will be visible to investors in marketplace.
                  </p>
                </div>
              )}

              {!projectData.seekingInvestment && (
                <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      Investment seeking is currently disabled. Enable it to make this project visible to investors.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild>
              <Link href={`/projects/${params.id}/departments`}>
                <Building2 className="h-4 w-4 mr-2" />
                Manage Departments
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/projects/${params.id}/milestones`}>
                <Target className="h-4 w-4 mr-2" />
                Manage Milestones
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/projects/${params.id}/tasks`}>
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Tasks
              </Link>
            </Button>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => router.push(`/projects/${params.id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !projectData.title.trim() || !projectData.description.trim() || !projectData.category}>
              {loading ? "Saving..." : "Save Changes"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
