'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import {
  Users,
  Clock,
  Award,
  Calendar,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Target,
  Briefcase,
  UserCheck,
} from 'lucide-react'

interface Member {
  id: string
  userId: string
  role: 'OWNER' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'TEAM_MEMBER' | 'VIEWER' | 'HR'
  accessLevel: string
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
    role: string
    major?: string | null
  }
  successScore?: number
  timeSpent?: number
  tasksCompleted?: number
  tasksInProgress?: number
  leaveRequests?: LeaveRequest[]
}

interface LeaveRequest {
  id: string
  userId: string
  projectId?: string | null
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  project?: {
    id: string
    name: string
  }
}

interface ProjectMemberManagementProps {
  projectId: string
  currentUserRole?: string
  currentUserId?: string
}

export default function ProjectMemberManagement({ projectId, currentUserRole, currentUserId }: ProjectMemberManagementProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  
  // Dialog states
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Form states
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('TEAM_MEMBER')
  const [leaveType, setLeaveType] = useState('SICK_LEAVE')
  const [leaveStartDate, setLeaveStartDate] = useState('')
  const [leaveEndDate, setLeaveEndDate] = useState('')
  const [leaveReason, setLeaveReason] = useState('')
  const [memberRole, setMemberRole] = useState('TEAM_MEMBER')

  // Check if user has permission to manage members
  const canManageMembers = currentUserRole === 'OWNER' || 
                          currentUserRole === 'PROJECT_MANAGER' || 
                          currentUserRole === 'PLATFORM_ADMIN' ||
                          currentUserRole === 'HR'

  useEffect(() => {
    fetchMembers()
    fetchLeaveRequests()
  }, [projectId])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await authFetch(`/api/projects/${projectId}/members`)
      const data = await response.json()

      if (data.success && data.data) {
        // Calculate success scores and time spent for each member
        const membersWithStats = await Promise.all(
          data.data.members.map(async (member: Member) => {
            try {
              // Fetch member's time entries
              const timeResponse = await authFetch(`/api/time-entries?userId=${member.userId}&projectId=${projectId}`)
              const timeData = await timeResponse.json()
              const totalHours = timeData.data?.reduce((acc: number, entry: any) => acc + entry.hours, 0) || 0

              // Fetch member's completed tasks
              const taskResponse = await authFetch(`/api/tasks?projectId=${projectId}&assigneeId=${member.userId}`)
              const taskData = await taskResponse.json()
              const tasks = taskData.data || []
              const completedTasks = tasks.filter((t: any) => t.status === 'DONE').length
              const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length

              // Calculate success score based on task completion rate
              const successScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

              return {
                ...member,
                successScore,
                timeSpent: totalHours,
                tasksCompleted: completedTasks,
                tasksInProgress: inProgressTasks,
              }
            } catch (error) {
              console.error('Error fetching member stats:', error)
              return member
            }
          })
        )
        setMembers(membersWithStats)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch project members',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveRequests = async () => {
    try {
      const response = await authFetch(`/api/leave-requests?projectId=${projectId}`)
      const data = await response.json()

      if (data.success && data.data) {
        setLeaveRequests(data.data)
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await authFetch(`/api/projects/${projectId}/members/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to invite member')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Member invited successfully',
        })
        setShowInviteDialog(false)
        setInviteEmail('')
        setInviteRole('TEAM_MEMBER')
        fetchMembers()
      } else {
        throw new Error(data.error || 'Failed to invite member')
      }
    } catch (error) {
      console.error('Error inviting member:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to invite member',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedMember) return

    try {
      const response = await authFetch(`/api/projects/${projectId}/members/${selectedMember.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: memberRole,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to update member role')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Member role updated successfully',
        })
        setShowRoleDialog(false)
        setSelectedMember(null)
        fetchMembers()
      } else {
        throw new Error(data.error || 'Failed to update member role')
      }
    } catch (error) {
      console.error('Error updating member role:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update member role',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) {
      return
    }

    try {
      const response = await authFetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to remove member')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Member removed successfully',
        })
        fetchMembers()
      } else {
        throw new Error(data.error || 'Failed to remove member')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove member',
        variant: 'destructive',
      })
    }
  }

  const handleLeaveRequest = async () => {
    if (!leaveType || !leaveStartDate || !leaveEndDate || !leaveReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await authFetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveType,
          startDate: new Date(leaveStartDate).toISOString(),
          endDate: new Date(leaveEndDate).toISOString(),
          reason: leaveReason.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to submit leave request')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Leave request submitted successfully',
        })
        setShowLeaveDialog(false)
        setLeaveType('SICK_LEAVE')
        setLeaveStartDate('')
        setLeaveEndDate('')
        setLeaveReason('')
        fetchLeaveRequests()
      } else {
        throw new Error(data.error || 'Failed to submit leave request')
      }
    } catch (error) {
      console.error('Error submitting leave request:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit leave request',
        variant: 'destructive',
      })
    }
  }

  const handleLeaveAction = async (leaveId: string, action: 'approve' | 'reject', rejectionReason?: string) => {
    try {
      const response = await authFetch(`/api/leave-requests/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          rejectionReason,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to update leave request')
      }

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: `Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
        fetchLeaveRequests()
      } else {
        throw new Error(data.error || 'Failed to update leave request')
      }
    } catch (error) {
      console.error('Error updating leave request:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update leave request',
        variant: 'destructive',
      })
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'PROJECT_MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'HR':
        return 'bg-pink-100 text-pink-800 border-pink-300'
      case 'TEAM_LEAD':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'TEAM_MEMBER':
        return 'bg-slate-100 text-slate-800 border-slate-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getLeaveStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Team & Role Management</CardTitle>
              <CardDescription>Manage project members, roles, and performance</CardDescription>
            </div>
          </div>
          {canManageMembers && (
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-lg bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to join this project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                        <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                        <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember}>Send Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">
              <Users className="w-4 h-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="leave">
              <Calendar className="w-4 h-4 mr-2" />
              Leave Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                  <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                  <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Total Members</span>
                </div>
                <div className="text-2xl font-bold">{members.length}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Avg. Success Score</span>
                </div>
                <div className="text-2xl font-bold">
                  {members.length > 0 ? Math.round(members.reduce((acc, m) => acc + (m.successScore || 0), 0) / members.length) : 0}%
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Hours</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(members.reduce((acc, m) => acc + (m.timeSpent || 0), 0))}h
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Tasks Completed</span>
                </div>
                <div className="text-2xl font-bold">
                  {members.reduce((acc, m) => acc + (m.tasksCompleted || 0), 0)}
                </div>
              </Card>
            </div>

            {/* Members Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Success Score</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Joined</TableHead>
                    {canManageMembers && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={canManageMembers ? 7 : 6} className="text-center py-8">
                        Loading members...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManageMembers ? 7 : 6} className="text-center py-8">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                              {member.user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{member.user.name}</div>
                              <div className="text-sm text-muted-foreground">{member.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 flex-1 max-w-[100px]">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${member.successScore || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{member.successScore || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{Math.round(member.timeSpent || 0)}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              {member.tasksCompleted || 0} Done
                            </Badge>
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                              {member.tasksInProgress || 0} In Progress
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        {canManageMembers && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMember(member)
                                  setMemberRole(member.role)
                                  setShowRoleDialog(true)
                                }}
                                disabled={member.role === 'OWNER'}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(member.userId)}
                                disabled={member.role === 'OWNER' || member.userId === currentUserId}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Leave Requests</h3>
                <p className="text-sm text-muted-foreground">Manage team leave requests</p>
              </div>
              <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-lg bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Submit Leave Request</DialogTitle>
                    <DialogDescription>Request time off from the project</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="leaveType">Leave Type *</Label>
                      <Select value={leaveType} onValueChange={setLeaveType}>
                        <SelectTrigger id="leaveType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                          <SelectItem value="PERSONAL_LEAVE">Personal Leave</SelectItem>
                          <SelectItem value="VACATION">Vacation</SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                          <SelectItem value="BEREAVEMENT">Bereavement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={leaveStartDate}
                          onChange={(e) => setLeaveStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={leaveEndDate}
                          onChange={(e) => setLeaveEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason *</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please provide a reason for your leave request..."
                        rows={3}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLeaveRequest}>Submit Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests found
                </div>
              ) : (
                leaveRequests.map((leave) => {
                  const member = members.find(m => m.userId === leave.userId)
                  return (
                    <Card key={leave.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                              {member?.user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="font-medium">{member?.user.name || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">
                                {leave.leaveType.replace('_', ' ')}
                              </div>
                            </div>
                            <div className="ml-auto">
                              {getLeaveStatusBadge(leave.status)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{leave.reason}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {leave.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-sm text-red-700 dark:text-red-400">
                              <strong>Rejection Reason:</strong> {leave.rejectionReason}
                            </div>
                          )}
                        </div>
                        {canManageMembers && leave.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLeaveAction(leave.id, 'approve')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const reason = prompt('Please provide a reason for rejection:')
                                if (reason) {
                                  handleLeaveAction(leave.id, 'reject', reason)
                                }
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Role Update Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="w-full sm:max-w-md bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Update Member Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedMember?.user.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memberRole">Role *</Label>
              <Select value={memberRole} onValueChange={setMemberRole}>
                <SelectTrigger id="memberRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                  <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
