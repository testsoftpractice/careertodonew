'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log('[AdminAuthGuard] Checking auth. User:', user?.email, 'Role:', user?.role, 'Loading:', loading)
    
    // Redirect to auth if not logged in
    if (!loading && !user) {
      console.log('[AdminAuthGuard] Not logged in, redirecting to auth')
      router.push('/auth?redirect=/admin')
      return
    }

    // Redirect if not a platform admin
    if (!loading && user && user.role !== 'PLATFORM_ADMIN') {
      console.log('[AdminAuthGuard] Not a platform admin, redirecting to auth')
      router.push('/auth?error=unauthorized&redirect=/admin')
      return
    }
    
    console.log('[AdminAuthGuard] Auth check passed, allowing access')
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated or not admin
  if (!user || user.role !== 'PLATFORM_ADMIN') {
    return null
  }

  return <>{children}</>
}
