'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Mail,
  User,
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
  FileText,
  Briefcase,
  DollarSign,
  Star,
  Target,
  FolderKanban,
  GraduationCap,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { IPHistoryDialog } from '@/components/admin/ip-history-dialog'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  verificationStatus: string
  mobileNumber?: string | null
  major: string | null
  graduationYear: number | null
  bio: string | null
  location: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  avatar: string | null
  university: {
    id: string
    name: string
    code: string
    location: string
    verificationStatus: string
  } | null
  projects: Array<{
    id: string
    name: string
    description: string
    approvalStatus: string
    status: string
    createdAt: string
  }>
  projectRoles: {
    isProjectOwner: boolean
    isProjectMember: boolean
    ownedProjectsCount: number
    participatingProjectsCount: number
    participatingProjectsList: Array<{
      projectId: string
      projectName: string
      role: string
      isOwner: boolean
    }>
  }
  taskStats: {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    todoTasks: number
    completionRate: number
  }
  stats: {
    projectsOwned: number
    projectsParticipating: number
    tasks: number
    jobApplications: number
    investments: number
    totalPoints: number
    executionScore: number | null
    collaborationScore: number | null
    leadershipScore: number | null
    ethicsScore: number | null
    reliabilityScore: number | null
  }
  roleSpecificData: any
  createdAt: string
  lastLoginAt: string | null
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [ipDialogOpen, setIpDialogOpen] = useState(false)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setUser(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch user details',
          variant: 'destructive',
        })
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user details. Please try again.',
        variant: 'destructive',
      })
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  const handleVerification = async (status: 'VERIFIED' | 'REJECTED') => {
    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus: status
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `User ${status === 'VERIFIED' ? 'approved' : 'rejected'} successfully`,
        })
        fetchUser()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update user',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive'
      })
    } finally {
      setProcessing(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      STUDENT: 'bg-blue-500/10 text-blue-500',
      UNIVERSITY_ADMIN: 'bg-purple-500/10 text-purple-500',
      EMPLOYER: 'bg-green-500/10 text-green-500',
      INVESTOR: 'bg-orange-500/10 text-orange-500',
      PLATFORM_ADMIN: 'bg-red-500/10 text-red-500',
      MENTOR: 'bg-cyan-500/10 text-cyan-500',
    }
    return (
      <Badge className={roleColors[role] || 'bg-gray-500/10 text-gray-500'}>
        {role.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getVerificationBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      UNDER_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      VERIFIED: 'bg-green-500/10 text-green-500 border-green-500/20',
      REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    }
    return (
      <Badge className={statusColors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getScoreDisplay = (score: number | null) => {
    if (score === null) return 'N/A'
    return `${Math.round(score)}/100`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/users" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Users</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">User Profile</h1>
                <p className="text-sm text-muted-foreground">View user details and manage account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIpDialogOpen(true)} disabled={!user}>
                <Globe className="h-4 w-4 mr-2" />
                IP History
              </Button>
              <Button variant="outline" size="sm" onClick={fetchUser} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(user.role)}
                      {getVerificationBadge(user.verificationStatus)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  {user.mobileNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <path d="M22 16.92v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9.02m10.5 0H12a2 2 0 0 1 2 2v9.02M16 2.08V6" />
                          <path d="M22 12h-6m-6 4h-6m2-10h4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground">{user.mobileNumber}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.location}</span>
                    </div>
                  )}
                  {user.university && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.university.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Last active {new Date(user.lastLoginAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Project Roles Badges */}
                  {(user.projectRoles.isProjectOwner || user.projectRoles.isProjectMember) && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {user.projectRoles.isProjectOwner && (
                        <Badge variant="default" className="bg-blue-500">
                          Project Owner ({user.projectRoles.ownedProjectsCount})
                        </Badge>
                      )}
                      {user.projectRoles.isProjectMember && (
                        <Badge variant="secondary">
                          Team Member ({user.projectRoles.participatingProjectsCount})
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* External Links */}
                {(user.linkedinUrl || user.portfolioUrl) && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Links</div>
                    <div className="space-y-2">
                      {user.linkedinUrl && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            LinkedIn Profile
                          </Link>
                        </Button>
                      )}
                      {user.portfolioUrl && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Portfolio
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Verification Actions */}
                {user.verificationStatus === 'PENDING' && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Verification</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerification('VERIFIED')}
                        disabled={processing}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVerification('REJECTED')}
                        disabled={processing}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Info */}
            {(user.major || user.graduationYear) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.major && (
                    <div>
                      <div className="text-xs text-muted-foreground">Major</div>
                      <div className="text-sm font-medium">{user.major}</div>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div>
                      <div className="text-xs text-muted-foreground">Graduation Year</div>
                      <div className="text-sm font-medium">{user.graduationYear}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.totalPoints}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects Owned</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.projectsOwned}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.tasks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Participating</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.projectsParticipating}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.jobApplications}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investments</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.stats.investments}</div>
                </CardContent>
              </Card>
            </div>

            {/* Reputation Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Reputation Scores
                </CardTitle>
                <CardDescription>User's performance metrics across different areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Execution</div>
                    <div className="text-2xl font-bold">{getScoreDisplay(user.stats.executionScore)}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Collaboration</div>
                    <div className="text-2xl font-bold">{getScoreDisplay(user.stats.collaborationScore)}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Leadership</div>
                    <div className="text-2xl font-bold">{getScoreDisplay(user.stats.leadershipScore)}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Ethics</div>
                    <div className="text-2xl font-bold">{getScoreDisplay(user.stats.ethicsScore)}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg sm:col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">Reliability</div>
                    <div className="text-2xl font-bold">{getScoreDisplay(user.stats.reliabilityScore)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Task Statistics
                </CardTitle>
                <CardDescription>User's task completion and progress metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{user.taskStats.totalTasks}</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold">{user.taskStats.completedTasks}</div>
                    <div className="text-xs text-muted-foreground mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold">{user.taskStats.inProgressTasks}</div>
                    <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold">{user.taskStats.todoTasks}</div>
                    <div className="text-xs text-muted-foreground mt-1">To Do</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">Completion Rate</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.taskStats.completionRate}%</div>
                    {user.taskStats.totalTasks > 0 && (
                      <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                          style={{ width: `${user.taskStats.completionRate}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Roles Details */}
            {(user.projectRoles.isProjectOwner || user.projectRoles.isProjectMember) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    Project Involvement
                  </CardTitle>
                  <CardDescription>User's role across different projects</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.projectRoles.participatingProjectsList.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {user.projectRoles.participatingProjectsList.map((proj) => (
                        <div key={proj.projectId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{proj.projectName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={proj.isOwner ? 'default' : 'secondary'} className="text-xs">
                                {proj.isOwner ? 'Owner' : proj.role}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${proj.projectId}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No project involvement found</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Role-Specific Information */}
            {user.role === 'STUDENT' && user.roleSpecificData?.studentStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Student Performance
                  </CardTitle>
                  <CardDescription>Academic and project performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Total Projects</div>
                      <div className="text-2xl font-bold">{user.roleSpecificData.studentStats.totalProjects}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.roleSpecificData.studentStats.ownedProjects} owned, {user.roleSpecificData.studentStats.participatingProjects} participating
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Task Completion</div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{user.taskStats.completionRate}%</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.taskStats.completedTasks}/{user.taskStats.totalTasks} tasks completed
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">Average Project Tasks</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {user.roleSpecificData.studentStats.averageProjectProgress}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Average tasks per project</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === 'UNIVERSITY_ADMIN' && user.roleSpecificData?.universityStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    University Overview
                  </CardTitle>
                  <CardDescription>University-wide project and student statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Total Projects</div>
                      <div className="text-2xl font-bold">{user.roleSpecificData.universityStats.totalProjects}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.roleSpecificData.universityStats.approvedProjects} approved
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Total Students</div>
                      <div className="text-2xl font-bold">{user.roleSpecificData.universityStats.totalStudents}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.roleSpecificData.universityStats.activeStudents} active
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Project Tasks</div>
                      <div className="text-2xl font-bold">{user.roleSpecificData.universityStats.totalProjectTasks}</div>
                      <div className="text-xs text-muted-foreground mt-1">Total tasks across all projects</div>
                    </div>
                  </div>
                  {user.roleSpecificData.universityStats.recentStudents && user.roleSpecificData.universityStats.recentStudents.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-3">Recent Students</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {user.roleSpecificData.universityStats.recentStudents.map((student: any) => (
                          <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student._count?.Project || 0} projects
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user.role === 'EMPLOYER' && user.roleSpecificData?.employerStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Business Dashboard
                  </CardTitle>
                  <CardDescription>Company project and hiring statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Published Projects</div>
                      <div className="text-2xl font-bold">{user.roleSpecificData.employerStats.publishedProjects}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        of {user.roleSpecificData.employerStats.totalProjects} total
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Vacancies</div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {user.roleSpecificData.employerStats.filledPositions}/{user.roleSpecificData.employerStats.totalPositions}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">positions filled</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Team Members</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {user.stats.projectsParticipating}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">across projects</div>
                    </div>
                  </div>
                  {user.roleSpecificData.employerStats.recentVacancies && user.roleSpecificData.employerStats.recentVacancies.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-3">Recent Vacancies</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {user.roleSpecificData.employerStats.recentVacancies.map((vacancy: any) => (
                          <div key={vacancy.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{vacancy.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {vacancy.filled}/{vacancy.slots} positions filled
                              </div>
                            </div>
                            <Badge variant={vacancy.status === 'OPEN' ? 'default' : 'secondary'}>
                              {vacancy.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user.role === 'INVESTOR' && user.roleSpecificData?.investorStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Investment Portfolio
                  </CardTitle>
                  <CardDescription>Investment statistics and project performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Total Invested</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${user.roleSpecificData.investorStats.totalInvestedAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        across {user.roleSpecificData.investorStats.totalInvestments} investments
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Invested Projects</div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {user.roleSpecificData.investorStats.investedProjects}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        projects backed
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Active Projects</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {user.roleSpecificData.investorStats.activeProjects}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        in progress
                      </div>
                    </div>
                  </div>
                  {user.roleSpecificData.investorStats.recentInvestments && user.roleSpecificData.investorStats.recentInvestments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-3">Recent Investments</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {user.roleSpecificData.investorStats.recentInvestments.map((investment: any) => (
                          <div key={investment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{investment.Project?.name || 'Unknown Project'}</div>
                              <div className="text-xs text-muted-foreground">
                                ${investment.amount?.toLocaleString() || 'N/A'}
                              </div>
                            </div>
                            <Badge variant={investment.Project?.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {investment.Project?.status || 'UNKNOWN'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user.role === 'PLATFORM_ADMIN' && user.roleSpecificData?.platformStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription>Platform-wide statistics and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.roleSpecificData.platformStats.totalProjects}</div>
                      <div className="text-xs text-muted-foreground mt-1">Total Projects</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{user.roleSpecificData.platformStats.pendingApprovals}</div>
                      <div className="text-xs text-muted-foreground mt-1">Pending Approvals</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{user.roleSpecificData.platformStats.totalUsers}</div>
                      <div className="text-xs text-muted-ont-foreground mt-1">Registered Users</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.roleSpecificData.platformStats.totalTasks}</div>
                      <div className="text-xs text-muted-foreground mt-1">Platform Tasks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bio */}
            {user.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Projects requiring review or pending approval</CardDescription>
              </CardHeader>
              <CardContent>
                {user.projects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending projects</p>
                ) : (
                  <div className="space-y-4">
                    {user.projects.map((project) => (
                      <div key={project.id} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              href={`/admin/approvals/projects/${project.id}`}
                              className="font-semibold hover:underline"
                            >
                              {project.name}
                            </Link>
                            <div className="text-xs text-muted-foreground mt-1">
                              Submitted {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {getVerificationBadge(project.approvalStatus)}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* IP History Dialog */}
      {user && (
        <IPHistoryDialog
          open={ipDialogOpen}
          onOpenChange={setIpDialogOpen}
          userId={user.id}
          userName={user.name}
        />
      )}
    </div>
  )
}
