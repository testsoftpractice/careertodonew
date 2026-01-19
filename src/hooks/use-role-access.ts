'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

/**
 * Hook to enforce role-based access control on protected pages
 * Redirects users to appropriate dashboard if they don't have access
 *
 * @param allowedRoles - Array of roles allowed to access the current page
 * @param redirectPath - Optional custom redirect path (defaults to role-based dashboard)
 */
export function useRoleAccess(allowedRoles: string[], redirectPath?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't check while loading
    if (loading) return

    // Redirect to auth if not logged in
    if (!user) {
      console.log('[ROLE-ACCESS] No user found, redirecting to auth...')
      router.push('/auth')
      return
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
      console.log(
        '[ROLE-ACCESS] Access denied:',
        'User role:',
        user.role,
        'Required roles:',
        allowedRoles
      )

      // Redirect to appropriate dashboard based on user's role
      const targetPath = redirectPath || getDashboardForRole(user.role)
      console.log('[ROLE-ACCESS] Redirecting to:', targetPath)
      router.push(targetPath)
    }
  }, [user, loading, allowedRoles, redirectPath, router])
}

/**
 * Get the appropriate dashboard path for a user role
 */
function getDashboardForRole(role: string): string {
  const dashboardPaths: Record<string, string> = {
    STUDENT: '/dashboard/student',
    MENTOR: '/dashboard/student', // Mentors use student dashboard
    EMPLOYER: '/dashboard/employer',
    INVESTOR: '/dashboard/investor',
    UNIVERSITY_ADMIN: '/dashboard/university',
    PLATFORM_ADMIN: '/admin',
  }

  return dashboardPaths[role] || '/'
}
