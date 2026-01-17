'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function AuthButton({ children, className, variant = 'default', ...props }: any) {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    logout()
    router.push('/auth')
  }

  if (user.role === 'STUDENT') {
    router.push('/dashboard/student')
  } else if (user.role === 'UNIVERSITY') {
    router.push('/dashboard/university')
  } else if (user.role === 'EMPLOYER') {
    router.push('/marketplace')
  } else if (user.role === 'INVESTOR') {
    router.push('/marketplace')
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        onClick={handleLogout}
        variant={variant}
        {...props}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign Out
      </button>
    </div>
  )
}
