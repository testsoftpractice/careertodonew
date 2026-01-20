'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, Plus, Crown, Shield, User } from 'lucide-react'
import { useState } from 'react'

interface BusinessMembersWidgetProps {
  businessId: string
  members: Array<{
    id: string
    role: string
    joinedAt: string | Date
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      role: string
    }
  }>
  myRole?: string
  onAddMember?: () => void
  onManageMember?: (memberId: string) => void
}

export function BusinessMembersWidget({
  businessId,
  members,
  myRole,
  onAddMember,
  onManageMember,
}: BusinessMembersWidgetProps) {
  const [showAll, setShowAll] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-purple-600" />
      default:
        return <User className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20'
      case 'HR_MANAGER':
        return 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
      case 'PROJECT_MANAGER':
        return 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
      case 'TEAM_LEAD':
        return 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20'
      case 'RECRUITER':
        return 'bg-pink-500/10 text-pink-700 hover:bg-pink-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20'
    }
  }

  const canAddMembers = myRole && ['OWNER', 'ADMIN', 'HR_MANAGER', 'RECRUITER'].includes(myRole)
  const canManageMembers = myRole && ['OWNER', 'ADMIN', 'HR_MANAGER'].includes(myRole)

  const displayMembers = showAll ? members : members.slice(0, 5)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Team Members
        </CardTitle>
        {canAddMembers && (
          <Button size="sm" onClick={onAddMember}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {displayMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No team members yet</p>
              {canAddMembers && (
                <p className="text-sm mt-2">Click "Add Member" to invite someone</p>
              )}
            </div>
          ) : (
            displayMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatar} alt={member.user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{member.user.name}</h4>
                      <Badge variant="outline" className={getRoleColor(member.role)}>
                        <span className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                  </div>
                </div>
                {canManageMembers && member.role !== 'OWNER' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onManageMember?.(member.id)}
                  >
                    Manage
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        {members.length > 5 && !showAll && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
            >
              View All {members.length} Members
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
