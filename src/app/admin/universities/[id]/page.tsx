'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Building2,
  Users,
  Database,
  ShieldCheck,
  MapPin,
  Globe,
  Edit,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface University {
  id: string
  name: string
  code: string
  description: string
  location: string
  website: string
  rankingScore: number | null
  rankingPosition: number | null
  verificationStatus: string
  totalStudents: number
  totalProjects: number
  createdAt: string
  updatedAt: string
  users: Array<{
    id: string
    name: string
    email: string
    role: string
    verificationStatus: string
    major: string
    graduationYear: number
    totalPoints: number
    createdAt: string
  }>
  _count: {
    users: number
  }
  statistics?: {
    totalStudents: number
    totalProjects: number
    pendingVerifications: number
    totalUsers: number
  }
}

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [universityId, setUniversityId] = useState<string>('')
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    website: '',
    rankingScore: '',
    rankingPosition: '',
    verificationStatus: '',
  })

  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setUniversityId(id)
      fetchUniversity(id)
    }
    init()
  }, [])

  const fetchUniversity = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/universities/${id}`)
      const data = await response.json()

      if (data.success) {
        setUniversity(data.data)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch university',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch university error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch university',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'University updated successfully',
        })
        setEditDialogOpen(false)
        fetchUniversity(universityId)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update university',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Update university error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update university',
        variant: 'destructive'
      })
    }
  }

  const handleVerifyStatus = async (status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED') => {
    try {
      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: status }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `University ${status.toLowerCase()} successfully`,
        })
        fetchUniversity(universityId)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update university',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Update status error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update university status',
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = () => {
    if (!university) return
    setFormData({
      name: university.name,
      code: university.code,
      description: university.description || '',
      location: university.location || '',
      website: university.website || '',
      rankingScore: university.rankingScore?.toString() || '',
      rankingPosition: university.rankingPosition?.toString() || '',
      verificationStatus: university.verificationStatus,
    })
    setEditDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      UNDER_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      VERIFIED: 'bg-green-500/10 text-green-500 border-green-500/20',
      SUSPENDED: 'bg-red-500/10 text-red-500 border-red-500/20',
      REJECTED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    }
    return (
      <Badge className={statusColors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      STUDENT: 'bg-blue-500/10 text-blue-500',
      UNIVERSITY_ADMIN: 'bg-purple-500/10 text-purple-500',
      EMPLOYER: 'bg-green-500/10 text-green-500',
      INVESTOR: 'bg-orange-500/10 text-orange-500',
      PLATFORM_ADMIN: 'bg-red-500/10 text-red-500',
    }
    return (
      <Badge className={roleColors[role] || 'bg-gray-500/10 text-gray-500'}>
        {role.replace(/_/g, ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">University Not Found</h3>
                <p className="text-muted-foreground mt-2">The university you're looking for doesn't exist.</p>
              </div>
              <Button onClick={() => router.push('/admin/universities')}>
                Back to Universities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/universities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Universities</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">{university.name}</h1>
                <p className="text-sm text-muted-foreground">University Details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={openEditDialog}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit University</DialogTitle>
                    <DialogDescription>
                      Update university information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">University Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">University Code</label>
                        <Input
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ranking Score</label>
                        <Input
                          type="number"
                          value={formData.rankingScore}
                          onChange={(e) => setFormData({ ...formData, rankingScore: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ranking Position</label>
                        <Input
                          type="number"
                          value={formData.rankingPosition}
                          onChange={(e) => setFormData({ ...formData, rankingPosition: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Verification Status</label>
                      <Select value={formData.verificationStatus} onValueChange={(value) => setFormData({ ...formData, verificationStatus: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="VERIFIED">Verified</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate}>Update University</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => fetchUniversity(universityId)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* University Overview */}
        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {university.name}
              </CardTitle>
              <CardDescription>
                <Badge variant="outline">{university.code}</Badge>
                {getStatusBadge(university.verificationStatus)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {university.description && (
                <p className="text-muted-foreground mb-4">{university.description}</p>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {university.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{university.location}</span>
                  </div>
                )}
                {university.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {new URL(university.website).hostname}
                    </a>
                  </div>
                )}
                {university.rankingScore && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Ranking Score: {university.rankingScore}</span>
                  </div>
                )}
                {university.rankingPosition && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <span>Position: #{university.rankingPosition}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {university.verificationStatus !== 'VERIFIED' && (
                <>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => handleVerifyStatus('VERIFIED')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Approve University
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => handleVerifyStatus('REJECTED')}
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Reject University
                  </Button>
                </>
              )}
              {university.verificationStatus === 'VERIFIED' && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleVerifyStatus('SUSPENDED')}
                >
                  <XCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  Suspend University
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {university.statistics?.totalUsers || university._count?.users || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {university.statistics?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Database className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {university.statistics?.totalProjects || university.totalProjects || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {university.statistics?.pendingVerifications || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>University Users</CardTitle>
                <CardDescription>
                  {university.users?.length || 0} users registered
                </CardDescription>
              </CardHeader>
              <CardContent>
                {university.users && university.users.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Major</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {university.users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{user.major || '-'}</TableCell>
                            <TableCell>{user.graduationYear || '-'}</TableCell>
                            <TableCell>{getStatusBadge(user.verificationStatus)}</TableCell>
                            <TableCell>{user.totalPoints || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users registered at this university yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>University Statistics</CardTitle>
                <CardDescription>Overview of university performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Total Users</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {university.statistics?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Students</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {university.statistics?.totalStudents || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold">Total Projects</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {university.statistics?.totalProjects || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold">Pending Verifications</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {university.statistics?.pendingVerifications || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Academic departments at this university</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Department information will be available soon</p>
                  <p className="text-sm mt-2">Departments are tracked through projects</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>University Projects</CardTitle>
                <CardDescription>Projects created by university members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>{university.statistics?.totalProjects || university.totalProjects || 0} projects</p>
                  <p className="text-sm mt-2">Project details are tracked in the Projects module</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
