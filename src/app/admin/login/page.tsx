'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PublicHeader from '@/components/public-header'
import { toast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/validate')
        const data = await response.json()
        if (data.valid) {
          router.push('/admin')
        } else {
          // Not logged in, show login form
        }
      } catch (err) {
        console.error('Auth check error:', err)
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return
    
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token in cookie
        document.cookie = `session=${encodeURIComponent(data.token)}; path=/; max-age=86400; SameSite=Lax`
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back, Administrator',
        })

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin')
        }, 500)
      } else {
        setError(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground mb-6">
              Platform Administration Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@careertodo.com"
                className="w-full px-4 py-3 border rounded-md"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border rounded-md"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-md font-medium transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Credentials:</strong> admin@careertodo.com / Password123!
              </p>
              <p className="text-xs text-muted-foreground">
                In production, use proper admin credentials from the database.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
