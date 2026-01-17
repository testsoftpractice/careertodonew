'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Shield, Trash2, MoreHorizontal, Crown, Users } from 'lucide-react'
import { ProjectRole } from '@/lib/models/project-roles'
import { getAvailableActions, canPerformAction } from '@/lib/models/project-roles'

interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: ProjectRole
  department?: string
  joinedAt: string
  status: 'active' | 'pending' | 'inactive'
  xp?: number
  actions?: string[]
}

interface ProjectRolesManagerProps {
  projectId: string
  currentUserRole?: ProjectRole
}

export default function ProjectRolesManager({ projectId, currentUserRole }: ProjectRolesManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'LEADERSHIP' | 'MANAGEMENT' | 'CONTRIBUTORS'>('ALL')

  // Mock team members
  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      role: ProjectRole.PROJECT_LEAD,
      department: 'Management',
      joinedAt: '2024-12-01T10:00:00Z',
      status: 'active',
      xp: 1250,
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg',
      role: ProjectRole.CO_LEAD,
      department: 'Technical',
      joinedAt: '2024-12-02T14:00:00Z',
      status: 'active',
      xp: 980,
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: '/avatars/emily.jpg',
      role: ProjectRole.DEPARTMENT_HEAD,
      department: 'Engineering',
      joinedAt: '2024-12-05T09:30:00Z',
      status: 'active',
      xp: 850,
    },
    {
      id: '4',
      name: 'James Wilson',
      avatar: '/avatars/james.jpg',
      role: ProjectRole.TEAM_LEAD,
      department: 'Design',
      joinedAt: '2024-12-08T11:00:00Z',
      status: 'active',
      xp: 720,
    },
    {
      id: '5',
      name: 'Jessica Taylor',
      avatar: '/avatars/jessica.jpg',
      role: ProjectRole.MENTOR,
      department: 'Management',
      joinedAt: '2024-12-10T16:00:00Z',
      status: 'active',
      xp: 680,
    },
    {
      id: '6',
      name: 'David Lee',
      avatar: '/avatars/david.jpg',
      role: ProjectRole.SENIOR_CONTRIBUTOR,
      department: 'Engineering',
      joinedAt: '2024-12-12T10:00:00Z',
      status: 'active',
      xp: 590,
    },
    {
      id: '7',
      name: 'Robert Martinez',
      avatar: '/avatars/robert.jpg',
      role: ProjectRole.CONTRIBUTOR,
      department: 'Engineering',
      joinedAt: '2024-12-15T08:45:00Z',
      status: 'active',
      xp: 450,
    },
    {
      id: '8',
      name: 'Amanda White',
      avatar: '/avatars/amanda.jpg',
      role: ProjectRole.JUNIOR_CONTRIBUTOR,
      department: 'Design',
      joinedAt: '2024-12-18T14:00:00Z',
      status: 'active',
      xp: 320,
    },
    {
      id: '9',
      name: 'Kevin Brown',
      avatar: '/avatars/kevin.jpg',
      role: ProjectRole.CONTRIBUTOR,
      department: 'Design',
      joinedAt: '2024-12-20T10:00:00Z',
      status: 'pending',
      xp: 280,
    },
  ]

  useEffect(() => {
    setMembers(mockMembers)
  }, [])

  const filteredMembers = members.filter(member => {
    if (filter === 'ALL') return true

    if (filter === 'LEADERSHIP') {
      return [ProjectRole.PROJECT_LEAD, ProjectRole.CO_LEAD].includes(member.role)
    }

    if (filter === 'MANAGEMENT') {
      return [ProjectRole.DEPARTMENT_HEAD, ProjectRole.TEAM_LEAD, ProjectRole.TECHNICAL_LEAD,
              ProjectRole.DESIGN_LEAD, ProjectRole.MARKETING_LEAD, ProjectRole.FINANCE_LEAD].includes(member.role)
    }

    if (filter === 'CONTRIBUTORS') {
      return [ProjectRole.SENIOR_CONTRIBUTOR, ProjectRole.CONTRIBUTOR].includes(member.role)
    }

    return false
  })

  const getRoleColor = (role: ProjectRole) => {
    switch (role) {
      case ProjectRole.PROJECT_LEAD:
        return 'bg-purple-100 border-purple-300 text-purple-700'
      case ProjectRole.CO_LEAD:
        return 'bg-blue-100 border-blue-300 text-blue-700'
      case ProjectRole.DEPARTMENT_HEAD:
        return 'bg-green-100 border-green-300 text-green-700'
      case ProjectRole.TEAM_LEAD:
        return 'bg-orange-100 border-orange-300 text-orange-700'
      case ProjectRole.MENTOR:
        return 'bg-pink-100 border-pink-300 text-pink-700'
      case ProjectRole.SENIOR_CONTRIBUTOR:
        return 'bg-indigo-100 border-indigo-300 text-indigo-700'
      case ProjectRole.CONTRIBUTOR:
        return 'bg-gray-100 border-gray-300 text-gray-700'
      case ProjectRole.JUNIOR_CONTRIBUTOR:
        return 'bg-gray-50 border-gray-200 text-gray-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getRoleBadgeText = (role: ProjectRole) => {
    switch (role) {
      case ProjectRole.PROJECT_LEAD:
        return 'Project Lead'
      case ProjectRole.CO_LEAD:
        return 'Co-Lead'
      case ProjectRole.DEPARTMENT_HEAD:
        return 'Department Head'
      case ProjectRole.TEAM_LEAD:
        return 'Team Lead'
      case ProjectRole.MENTOR:
        return 'Mentor'
      case ProjectRole.SENIOR_CONTRIBUTOR:
        return 'Senior'
      case ProjectRole.CONTRIBUTOR:
        return 'Contributor'
      case ProjectRole.JUNIOR_CONTRIBUTOR:
        return 'Junior'
      case ProjectRole.TECHNICAL_LEAD:
        return 'Tech Lead'
      case ProjectRole.DESIGN_LEAD:
        return 'Design Lead'
      case ProjectRole.MARKETING_LEAD:
        return 'Marketing Lead'
      case ProjectRole.FINANCE_LEAD:
        return 'Finance Lead'
      default:
        return role.replace('_', ' ')
    }
  }

  const handleInviteMember = () => {
    setShowInviteModal(true)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId))
  }

  const handleRoleChange = (memberId: string, newRole: ProjectRole) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m))
  }

  const availableActions = selectedMember ? getAvailableActions(selectedMember) : []

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Project Roles & Team</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage project team, assign roles, and control permissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={handleInviteMember}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Invite Member</span>
              <span className="sm:hidden">Invite</span>
            </Button>
            <Button variant="destructive" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Governance</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members ({members.length})</CardTitle>
            <CardDescription>Manage team roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
              <Button
                variant={filter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('ALL')}
              >
                All
              </Button>
              <Button
                variant={filter === 'LEADERSHIP' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('LEADERSHIP')}
              >
                Leadership
              </Button>
              <Button
                variant={filter === 'MANAGEMENT' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('MANAGEMENT')}
              >
                Management
              </Button>
              <Button
                variant={filter === 'CONTRIBUTORS' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('CONTRIBUTORS')}
              >
                Contributors
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${member.status === 'active' ? '' : 'opacity-60'}`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarFallback className="text-sm sm:text-base font-semibold bg-primary text-primary-foreground">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div>
                          <div className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">{member.name}</div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs sm:text-sm w-fit ${getRoleColor(member.role)}`}
                            >
                              {getRoleBadgeText(member.role)}
                            </Badge>
                            {member.department && (
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                • {member.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="ml-1">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      {member.xp && member.status === 'active' && (
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {member.xp} XP
                        </div>
                      )}

                      <div className="flex-1" />

                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleChange(member.id, ProjectRole.PROJECT_LEAD)}
                          disabled={!canPerformAction({ role: currentUserRole, action: 'manage' })}
                        >
                          <span className="text-xs sm:text-sm hidden sm:inline">Set as Lead</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>

                        {canPerformAction({ role: currentUserRole, action: 'delete' }) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Users className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">No Team Members</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    This project doesn't have any team members yet. Invite your first team member to get started.
                  </p>
                  <Button size="sm" onClick={handleInviteMember}>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite First Member
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedMember && (
          <Card className="mt-4 sm:mt-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Member Details</CardTitle>
                  <CardDescription>Manage role and permissions</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                  <AvatarFallback className="text-base sm:text-lg font-semibold bg-primary text-primary-foreground">
                    {selectedMember.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-base sm:text-lg mb-1">{selectedMember.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-sm sm:text-base w-fit ${getRoleColor(selectedMember.role)}`}
                    >
                      {getRoleBadgeText(selectedMember.role)}
                    </Badge>
                    {selectedMember.department && (
                      <span className="text-sm sm:text-base text-muted-foreground">
                        • {selectedMember.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Current Role</div>
                  <div className="font-semibold text-base sm:text-lg">{getRoleBadgeText(selectedMember.role)}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Status</div>
                  <div className="font-semibold text-base sm:text-lg">{selectedMember.status}</div>
                </div>
              </div>

              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Experience Points</div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  <span className="text-3xl sm:text-4xl font-bold text-yellow-600">
                    {selectedMember.xp || 0}
                  </span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">
                  Available Actions
                </div>
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                  {availableActions.includes('manage') && (
                    <Button variant="default" size="sm" className="w-full text-sm sm:text-base">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Button>
                  )}
                  {availableActions.includes('edit') && (
                    <Button variant="default" size="sm" className="w-full text-sm sm:text-base">
                      Edit Role
                    </Button>
                  )}
                  {availableActions.includes('create') && (
                    <Button variant="default" size="sm" className="w-full text-sm sm:text-base">
                      Assign Tasks
                    </Button>
                  )}
                  {availableActions.includes('delete') && (
                    <Button variant="destructive" size="sm" className="w-full text-sm sm:text-base">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Member
                    </Button>
                  )}
                  {availableActions.includes('approve') && (
                    <Button variant="default" size="sm" className="w-full text-sm sm:text-base">
                      Approve Role
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle>Team Statistics</CardTitle>
            <CardDescription>Overview of team composition and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">{members.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-600">{members.filter(m => m.status === 'pending').length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600">{members.filter(m => [ProjectRole.PROJECT_LEAD, ProjectRole.CO_LEAD, ProjectRole.DEPARTMENT_HEAD].includes(m.role)).length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Leadership</div>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mt-3 sm:mt-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{members.reduce((sum, m) => sum + (m.xp || 0), 0)}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{members.length > 0 ? Math.round(members.reduce((sum, m) => sum + (m.xp || 0), 0) / members.length) : 0}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Avg XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
