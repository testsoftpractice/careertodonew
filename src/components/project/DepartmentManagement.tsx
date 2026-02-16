'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import {
  Building2,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  Briefcase,
  Building,
} from 'lucide-react'

interface Department {
  id: string
  projectId: string
  name: string
  headId?: string | null
  head?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  } | null
  memberCount?: number
  members?: Array<{
    id: string
    userId: string
    User?: {
      id: string
      name: string
      email: string
      avatar?: string | null
    }
  }>
  createdAt: string
  updatedAt: string
}

interface DepartmentManagementProps {
  projectId: string
  canManageDepartments: boolean
  projectMembers: Array<{ id: string; userId: string; User?: { id: string; name: string; email: string } }>
}

export default function DepartmentManagement({
  projectId,
  canManageDepartments,
  projectMembers,
}: DepartmentManagementProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])

  // Form states
  const [departmentName, setDepartmentName] = useState('')
  const [departmentDescription, setDepartmentDescription] = useState('')
  const [departmentHeadId, setDepartmentHeadId] = useState<string>('')

  useEffect(() => {
    fetchDepartments()
  }, [projectId])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await authFetch(`/api/projects/${projectId}/departments`)
      const data = await response.json()

      if (data.success && data.data) {
        // API returns data directly, not data.data.departments
        const departmentsList = Array.isArray(data.data) ? data.data : []
        setDepartments(departmentsList)
      } else if (data.departments) {
        setDepartments(data.departments)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      // Departments might not exist yet, that's okay
      setDepartments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) {
      toast({
        title: 'Error',
        description: 'Department name is required',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await authFetch(`/api/projects/${projectId}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: departmentName.trim(),
          headId: departmentHeadId || null,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to create department')
      }

      const data = await response.json()
      if (data.success || data.data) {
        toast({
          title: 'Success',
          description: 'Department created successfully',
        })
        setShowCreateDialog(false)
        setDepartmentName('')
        setDepartmentDescription('')
        setDepartmentHeadId('')
        fetchDepartments()
      } else {
        throw new Error(data.error || 'Failed to create department')
      }
    } catch (error) {
      console.error('Error creating department:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create department',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment || !departmentName.trim()) {
      return
    }

    try {
      const response = await authFetch(`/api/projects/${projectId}/departments/${selectedDepartment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: departmentName.trim(),
          headId: departmentHeadId || null,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to update department')
      }

      const data = await response.json()
      if (data.success || data.data) {
        toast({
          title: 'Success',
          description: 'Department updated successfully',
        })
        setShowEditDialog(false)
        setSelectedDepartment(null)
        setDepartmentName('')
        setDepartmentHeadId('')
        fetchDepartments()
      } else {
        throw new Error(data.error || 'Failed to update department')
      }
    } catch (error) {
      console.error('Error updating department:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update department',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return

    try {
      const response = await authFetch(`/api/projects/${projectId}/departments/${selectedDepartment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to delete department')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Department deleted successfully',
        })
        setShowDeleteDialog(false)
        setSelectedDepartment(null)
        fetchDepartments()
      } else {
        throw new Error(data.error || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete department',
        variant: 'destructive',
      })
    }
  }

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department)
    setDepartmentName(department.name)
    setDepartmentHeadId(department.headId || '')
    setShowEditDialog(true)
  }

  const openDeleteDialog = (department: Department) => {
    setSelectedDepartment(department)
    setShowDeleteDialog(true)
  }

  const openAssignDialog = (department: Department) => {
    setSelectedDepartment(department)
    // Pre-select members already in this department
    const currentMemberIds = department.members?.map(m => m.userId) || []
    setSelectedMemberIds(currentMemberIds)
    setShowAssignDialog(true)
  }

  const handleAssignMembers = async () => {
    if (!selectedDepartment) return

    try {
      const response = await authFetch(
        `/api/projects/${projectId}/departments/${selectedDepartment.id}/members`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberIds: selectedMemberIds,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to assign members')
      }

      const data = await response.json()
      if (data.success || data.data) {
        toast({
          title: 'Success',
          description: 'Members assigned to department successfully',
        })
        setShowAssignDialog(false)
        setSelectedDepartment(null)
        setSelectedMemberIds([])
        fetchDepartments()
      } else {
        throw new Error(data.error || 'Failed to assign members')
      }
    } catch (error) {
      console.error('Error assigning members:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to assign members',
        variant: 'destructive',
      })
    }
  }

  const toggleMember = (userId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Organize project team into departments</CardDescription>
            </div>
          </div>
          {canManageDepartments && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl border">
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                  <DialogDescription>Add a new department to organize your team</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="deptName">Department Name *</Label>
                    <Input
                      id="deptName"
                      placeholder="e.g., Engineering, Design, Marketing"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deptHead">Department Head</Label>
                    <Select value={departmentHeadId} onValueChange={setDepartmentHeadId}>
                      <SelectTrigger id="deptHead">
                        <SelectValue placeholder="Select department head (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectMembers.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {member.User?.name || member.userId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDepartment}>Create Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Total Departments</span>
              </div>
              <div className="text-2xl font-bold">{departments.length}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Total Team Members</span>
              </div>
              <div className="text-2xl font-bold">{projectMembers.length}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Departments with Heads</span>
              </div>
              <div className="text-2xl font-bold">
                {departments.filter(d => d.headId).length}
              </div>
            </Card>
          </div>

          {/* Departments List */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
              <p className="text-sm mb-4 max-w-sm mx-auto">
                {canManageDepartments
                  ? 'Create your first department to organize your team members.'
                  : 'Departments will appear here once created by project administrators.'}
              </p>
              {canManageDepartments && (
                <Button onClick={() => setShowCreateDialog(true)} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Department
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepartments.map((department) => (
                <Card key={department.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Building className="w-4 h-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">{department.name}</CardTitle>
                      </div>
                      {canManageDepartments && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssignDialog(department)}
                            className="h-8 w-8 p-0"
                            title="Assign Members"
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(department)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(department)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {department.head && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Head:</span>
                        <span className="font-medium">{department.head.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Members:</span>
                      <Badge variant="secondary">{department.members?.length || department.memberCount || 0}</Badge>
                    </div>
                    {department.members && department.members.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {department.members.slice(0, 5).map((member) => (
                          <Badge key={member.id} variant="outline" className="text-xs">
                            {member.User?.name || member.userId}
                          </Badge>
                        ))}
                        {department.members.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{department.members.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Created {new Date(department.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Department Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl border">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information for {selectedDepartment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editDeptName">Department Name *</Label>
              <Input
                id="editDeptName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDeptHead">Department Head</Label>
              <Select value={departmentHeadId} onValueChange={setDepartmentHeadId}>
                <SelectTrigger id="editDeptHead">
                  <SelectValue placeholder="Select department head (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {projectMembers.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.User?.name || member.userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl border">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Members Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl border">
          <DialogHeader>
            <DialogTitle>Assign Members to {selectedDepartment?.name}</DialogTitle>
            <DialogDescription>
              Select project members to assign to this department
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {projectMembers.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No project members available
              </div>
            ) : (
              projectMembers.map((member) => (
                <label
                  key={member.userId}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(member.userId)}
                    onChange={() => toggleMember(member.userId)}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{member.User?.name || member.userId}</div>
                    <div className="text-xs text-muted-foreground">{member.User?.email || ''}</div>
                  </div>
                </label>
              ))
            )}
            <div className="text-sm text-muted-foreground">
              {selectedMemberIds.length} member(s) selected
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignMembers}>
              Assign Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
