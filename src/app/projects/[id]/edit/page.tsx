'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  RefreshCw,
  AlertTriangle,
  Info,
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
  const [resubmitting, setResubmitting] = useState(false)

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    category: "",
    status: "ACTIVE",
    seekingInvestment: false,
    investmentGoal: "",
    approvalStatus: "",
    reviewComments: "",
  })

  const [hrData, setHrData] = useState({
    ownerId: "",
    hrLeadId: "",
  })

  const categories = [
    { value: "NEWS_MEDIA", label: "News & Media", icon: "📰" },
    { value: "E_COMMERCE", label: "E-Commerce", icon: "🛒" },
    { value: "STARTUP", label: "Startup", icon: "🚀" },
    { value: "CONSULTING", label: "Consulting", icon: "💼" },
    { value: "MARKETING", label: "Marketing", icon: "📣" },
    { value: "RESEARCH", label: "Research", icon: "🔬" },
    { value: "TECHNOLOGY", label: "Technology", icon: "💻" },
    { value: "EDUCATION", label: "Education", icon: "📚" },
    { value: "HEALTHCARE", label: "Healthcare", icon: "🏥" },
    { value: "FINANCE", label: "Finance", icon: "💰" },
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
            title: project.name || project.title || "",
            description: project.description || "",
            category: project.category || "",
            status: project.status || "ACTIVE",
            seekingInvestment: project.seekingInvestment || false,
            investmentGoal: project.investmentGoal ? String(project.investmentGoal) : "",
            approvalStatus: project.approvalStatus || "",
            reviewComments: project.reviewComments || "",
          })
          setHrData({
            ownerId: project.ownerId || "",
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
          name: projectData.title,
          description: projectData.description,
          category: projectData.category,
          status: projectData.status,
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
        // Refresh project data
        const refreshResponse = await fetch(`/api/projects/${params.id}`)
        const refreshData = await refreshResponse.json()
        if (refreshData.success && refreshData.data) {
          setProjectData(prev => ({
            ...prev,
            approvalStatus: refreshData.data.approvalStatus || prev.approvalStatus,
            reviewComments: refreshData.data.reviewComments || prev.reviewComments,
          }))
        }
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

  const handleResubmit = async () => {
    if (!confirm("Are you sure you want to resubmit this project for approval? Make sure you have addressed all the required changes.")) {
      return
    }

    setResubmitting(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/resubmit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Project resubmitted for approval!",
        })
        router.push(`/projects/${params.id}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to resubmit project",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Resubmit project error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setResubmitting(false)
    }
  }

  const requiresChanges = projectData.approvalStatus === 'REQUIRE_CHANGES'
  const isPending = projectData.approvalStatus === 'PENDING'
  const isRejected = projectData.approvalStatus === 'REJECTED'

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
            <div className="flex items-center gap-2">
              <Badge variant="outline">{params.id}</Badge>
              {requiresChanges && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Changes Required
                </Badge>
              )}
              {isPending && (
                <Badge variant="secondary" className="gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Pending Review
                </Badge>
              )}
              {isRejected && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Rejected
                </Badge>
              )}
            </div>
          </div>

          {/* Show feedback when changes are required */}
          {requiresChanges && projectData.reviewComments && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
                Changes Requested by Admin
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
                <p className="mb-2">Please address the following feedback and resubmit your project:</p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-amber-200 dark:border-amber-700 mt-2">
                  <p className="text-sm whitespace-pre-wrap">{projectData.reviewComments}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Show rejection reason */}
          {isRejected && projectData.reviewComments && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">
                Project Not Approved
              </AlertTitle>
              <AlertDescription className="mt-2">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-md border mt-2">
                  <p className="text-sm whitespace-pre-wrap">{projectData.reviewComments}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Info for pending projects */}
          {isPending && (
            <Alert>
              <Info className="h-5 w-5" />
              <AlertTitle className="font-semibold">
                Project Under Review
              </AlertTitle>
              <AlertDescription>
                Your project is currently being reviewed by administrators. You can still make changes, but it will need to be reviewed again.
              </AlertDescription>
            </Alert>
          )}

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
                    <SelectItem value="IDEA">Idea</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="FUNDING">Funding</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                Active: Visible to team and marketplace | On Hold: Temporarily suspended | Completed: Successfully finished
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => router.push(`/projects/${params.id}`)} className="sm:order-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !projectData.title.trim() || !projectData.description.trim() || !projectData.category}
              className="sm:order-3 sm:flex-1"
            >
              {loading ? "Saving..." : "Save Changes"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
            {requiresChanges && (
              <Button 
                onClick={handleResubmit}
                disabled={resubmitting || loading}
                className="sm:order-2 bg-green-600 hover:bg-green-700"
              >
                {resubmitting ? "Resubmitting..." : "Resubmit for Approval"}
                <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
