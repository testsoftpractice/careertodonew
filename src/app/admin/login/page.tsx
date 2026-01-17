'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PublicHeader from '@/components/public-header'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store admin token
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        
        setError('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err: any) {
      console.error('Admin login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 border rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center">Admin Login</h2>
              <p className="text-sm text-muted-foreground text-center">Platform Administrator Access</p>
            </div>

            {error && (
              <div className={`p-4 rounded-lg border ${error.includes('successful') || error.includes('Login') || error.includes('Redirecting') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="text-center font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@careertodo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-4 p-4 bg-muted rounded-md text-sm">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p className="text-muted-foreground">Email: admin@careertodo.com</p>
              <p className="text-muted-foreground">Password: adminpassword123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
