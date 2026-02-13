'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Building2,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Users,
  Globe,
  MapPin,
  ShieldCheck,
  Clock,
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
  _count: {
    users: number
  }
}

export default function AdminUniversitiesPage() {
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    website: '',
    rankingScore: '',
    rankingPosition: '',
  })

  // Fetch universities
  useEffect(() => {
    fetchUniversities()
  }, [page, statusFilter])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/admin/universities?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setUniversities(data.data?.universities || [])
        setTotalCount(data.data?.totalCount || 0)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch universities',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch universities error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch universities',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1)
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

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'University created successfully',
        })
        setCreateDialogOpen(false)
        resetForm()
        fetchUniversities()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create university',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Create university error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create university',
        variant: 'destructive'
      })
    }
  }

  const handleUpdate = async () => {
    if (!selectedUniversity) return

    try {
      const response = await fetch(`/api/admin/universities/${selectedUniversity.id}`, {
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
        setSelectedUniversity(null)
        resetForm()
        fetchUniversities()
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/admin/universities/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'University deleted successfully',
        })
        fetchUniversities()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete university',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Delete university error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete university',
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = (university: University) => {
    setSelectedUniversity(university)
    setFormData({
      name: university.name,
      code: university.code,
      description: university.description || '',
      location: university.location || '',
      website: university.website || '',
      rankingScore: university.rankingScore?.toString() || '',
      rankingPosition: university.rankingPosition?.toString() || '',
    })
    setEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      location: '',
      website: '',
      rankingScore: '',
      rankingPosition: '',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Admin</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">University Management</h1>
                <p className="text-sm text-muted-foreground">Manage all platform universities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add University
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop:bg-black/50">
                  <DialogHeader>
                    <DialogTitle>Create New University</DialogTitle>
                    <DialogDescription>
                      Add a new university to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">University Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Stanford University"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">University Code *</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          placeholder="e.g., STAN"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the university"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Stanford, CA, USA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://university.edu"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="rankingScore">Ranking Score</Label>
                        <Input
                          id="rankingScore"
                          type="number"
                          value={formData.rankingScore}
                          onChange={(e) => setFormData({ ...formData, rankingScore: e.target.value })}
                          placeholder="e.g., 95.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rankingPosition">Ranking Position</Label>
                        <Input
                          id="rankingPosition"
                          type="number"
                          value={formData.rankingPosition}
                          onChange={(e) => setFormData({ ...formData, rankingPosition: e.target.value })}
                          placeholder="e.g., 5"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setCreateDialogOpen(false)
                      resetForm()
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create University</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered universities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {universities.filter(u => u.verificationStatus === 'VERIFIED').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Verified institutions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {universities.filter(u => u.verificationStatus === 'PENDING' || u.verificationStatus === 'UNDER_REVIEW').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {universities.reduce((sum, u) => sum + (u._count?.users || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all universities</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities by name, code, or location..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Universities List */}
        <Card>
          <CardHeader>
            <CardTitle>Universities List</CardTitle>
            <CardDescription>
              Showing {universities.length} of {totalCount} total universities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : universities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No universities found matching criteria
              </div>
            ) : (
              <div className="space-y-4">
                {universities.map((university) => (
                  <div key={university.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold">{university.name}</h3>
                        <Badge variant="outline">{university.code}</Badge>
                        {getStatusBadge(university.verificationStatus)}
                      </div>
                      {university.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {university.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {university.location && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {university.location}
                          </span>
                        )}
                        {university.website && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {new URL(university.website).hostname}
                          </span>
                        )}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {university._count?.users || 0} users
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/universities/${university.id}`)}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(university)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(university.id, university.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && universities.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(totalCount / pageSize)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(totalCount / pageSize)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="backdrop:bg-black/50">
          <DialogHeader>
            <DialogTitle>Edit University</DialogTitle>
            <DialogDescription>
              Update university information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">University Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">University Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-rankingScore">Ranking Score</Label>
                <Input
                  id="edit-rankingScore"
                  type="number"
                  value={formData.rankingScore}
                  onChange={(e) => setFormData({ ...formData, rankingScore: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rankingPosition">Ranking Position</Label>
                <Input
                  id="edit-rankingPosition"
                  type="number"
                  value={formData.rankingPosition}
                  onChange={(e) => setFormData({ ...formData, rankingPosition: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false)
              setSelectedUniversity(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update University</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
