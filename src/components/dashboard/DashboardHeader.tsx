'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowLeft,
  RefreshCw,
  Edit,
  Settings,
  MoreVertical,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  showEdit?: boolean
  showRefresh?: boolean
  showSettings?: boolean
  showMoreActions?: boolean
  onEdit?: () => void
  onRefresh?: () => void
  extraActions?: React.ReactNode
  badge?: string
}

export default function DashboardHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  showEdit = false,
  showRefresh = false,
  showSettings = false,
  showMoreActions = false,
  onEdit,
  onRefresh,
  extraActions,
  badge,
}: DashboardHeaderProps) {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear auth context handles the redirect
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="border-b bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left side - Back button and Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {backTo && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={backTo} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{backLabel}</span>
                </Link>
              </Button>
            )}
            
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                <h1 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1">{title}</h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
                )}
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {extraActions}

            {showRefresh && onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
            )}

            {showEdit && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Edit</span>
              </Button>
            )}

            {showSettings && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <SettingsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Settings</span>
                </Link>
              </Button>
            )}

            {showMoreActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {showSettings && (
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                  )}
                  {showRefresh && onRefresh && (
                    <DropdownMenuItem onClick={onRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!showMoreActions && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
