'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PublicHeader from '@/components/public-header'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to admin dashboard without authentication
    const timer = setTimeout(() => {
      router.push('/admin')
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-card">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center">Authentication Disabled</h2>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Redirecting to admin dashboard...
              </p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-center text-sm">
                <strong>ℹ️ Note:</strong> Authentication is temporarily disabled for testing.
                You'll be redirected to the admin dashboard automatically.
              </p>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                You'll be redirected in 1 second...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
