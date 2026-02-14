import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, LogOut, Bell, User } from 'lucide-react'
import Link from 'next/link'

interface WelcomeHeaderProps {
  user?: {
    id: string
    name: string
    email?: string
    avatar?: string
    role?: string
    university?: {
      name: string
      code?: string
    }
    major?: string
    graduationYear?: number
    bio?: string
    verificationStatus?: string
  }
  additionalActions?: Array<{
    label: string
    onClick: () => void
  } | {
    label: string
    href: string
  }>
  showNotifications?: boolean
  notificationCount?: number
  onLogout?: () => void
  onSettings?: () => void
  className?: string
}

export function WelcomeHeader({
  user,
  additionalActions = [],
  showNotifications = true,
  notificationCount = 0,
  onLogout,
  onSettings,
  className = '',
}: WelcomeHeaderProps) {
  const getRoleColor = (role?: string) => {
    const colors: Record<string, string> = {
      STUDENT: 'bg-blue-500',
      MENTOR: 'bg-purple-500',
      EMPLOYER: 'bg-orange-500',
      INVESTOR: 'bg-emerald-500',
      UNIVERSITY_ADMIN: 'bg-indigo-500',
      PLATFORM_ADMIN: 'bg-slate-700',
    }
    return colors[role || 'STUDENT'] || 'bg-slate-500'
  }

  const getRoleLabel = (role?: string) => {
    const labels: Record<string, string> = {
      STUDENT: 'Student',
      MENTOR: 'Mentor',
      EMPLOYER: 'Employer',
      INVESTOR: 'Investor',
      UNIVERSITY_ADMIN: 'University Admin',
      PLATFORM_ADMIN: 'Platform Admin',
    }
    return labels[role || 'STUDENT'] || 'Student'
  }

  return (
    <div className={`${className}`}>
      {/* Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Avatar and User Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shadow-lg ring-2 ring-primary/20 flex-shrink-0">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-lg">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-muted-foreground">
                {user?.university && (
                  <span>
                    {user.university.name}
                    {user.university.code && (
                      <span>
                        {' '} ({user.university.code})
                      </span>
                    )}
                  </span>
                )}
                {user?.role && (
                  <>
                    {' '} ·{' '}
                    <Badge variant="secondary" className="text-xs">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </>
                )}
                {user?.major && user.graduationYear && (
                  <>
                    {' '} ·{' '}
                    <span className="hidden sm:inline">
                      {user.major} {' '} Class of {user.graduationYear}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            {showNotifications && (
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link href="/dashboard/notifications" aria-label={`View notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}>
                  <Bell className="h-5 w-5 sm:h-6" aria-hidden="true" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full" aria-hidden="true">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {/* Settings */}
            <Button variant="ghost" size="sm" onClick={onSettings} className="hidden sm:flex" aria-label="Open settings">
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Additional Actions */}
            {additionalActions.map((action, index) => {
              const hasHref = 'href' in action
              return hasHref ? (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <a href={(action as { href: string }).href} className="flex items-center">
                    {action.label}
                  </a>
                </Button>
              ) : (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={(action as { onClick: () => void }).onClick}
                  className="hidden sm:flex"
                >
                  {action.label}
                </Button>
              )
            })}

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" aria-label="Log out">
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
