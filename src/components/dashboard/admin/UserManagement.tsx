import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCog, Briefcase, TrendingUp, Calendar } from 'lucide-react'

export interface UserRole {
  role: string
  count: number
  growth: number
  active: number
}

interface UserBreakdown {
  total: number
  students: number
  universities: number
  employers: number
  investors: number
  admins: number
  mentors: number
}

interface UserManagementProps {
  userBreakdown: UserBreakdown
  roleBreakdown: UserRole[]
  newRegistrations: number
  verifiedUsers: number
  pendingVerifications: number
  className?: string
}

export function UserManagement({
  userBreakdown,
  roleBreakdown,
  newRegistrations,
  verifiedUsers,
  pendingVerifications,
  className = '',
}: UserManagementProps) {
  const roleIcons = {
    STUDENT: Users,
    UNIVERSITY: Briefcase,
    EMPLOYER: Briefcase,
    INVESTOR: TrendingUp,
    PLATFORM_ADMIN: UserCog,
    MENTOR: Users,
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <UserCog className="w-5 h-5 text-primary" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* User Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {userBreakdown.total.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Users</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {verifiedUsers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Verified</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              +{newRegistrations}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New Today</div>
          </div>
        </div>

        {/* Pending Verifications */}
        {pendingVerifications > 0 && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-sm font-semibold">Pending Verifications</div>
                  <div className="text-xs text-muted-foreground">
                    Action required
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {pendingVerifications}
              </span>
            </div>
          </div>
        )}

        {/* User Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">User Breakdown</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-primary">{userBreakdown.students}</div>
              <div className="text-[10px] text-muted-foreground">Students</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-emerald-600">{userBreakdown.universities}</div>
              <div className="text-[10px] text-muted-foreground">Universities</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-blue-600">{userBreakdown.employers}</div>
              <div className="text-[10px] text-muted-foreground">Employers</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-purple-600">{userBreakdown.investors}</div>
              <div className="text-[10px] text-muted-foreground">Investors</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-amber-600">{userBreakdown.admins}</div>
              <div className="text-[10px] text-muted-foreground">Admins</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold text-pink-600">{userBreakdown.mentors}</div>
              <div className="text-[10px] text-muted-foreground">Mentors</div>
            </div>
          </div>
        </div>

        {/* Role Statistics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserCog className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Role Activity</span>
          </div>
          <div className="space-y-2">
            {roleBreakdown.slice(0, 5).map((role) => {
              const RoleIcon = roleIcons[role.role as keyof typeof roleIcons] || Users

              return (
                <div
                  key={role.role}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <RoleIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize">{role.role.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.active} active
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-primary">{role.count}</div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${role.growth >= 0 ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}`}
                    >
                      {role.growth >= 0 ? '+' : ''}{role.growth}%
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
