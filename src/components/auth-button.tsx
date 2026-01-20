'use client'

import { useAuth } from '@/contexts/auth-context'

export function AuthButton({ children, className, variant = 'default', ...props }: any) {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    // The logout function in auth context handles all cleanup and redirect
    logout()
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        onClick={handleLogout}
        {...props}
        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  )
}
