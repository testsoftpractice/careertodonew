'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  university?: any
  major?: string
  graduationYear?: number
  progressionLevel?: string
  verificationStatus?: string
  bio?: string
  location?: string
  linkedinUrl?: string
  portfolioUrl?: string
  reputationScores?: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, authToken: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load auth state from localStorage on mount - prevent SSR access
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      console.log('[AUTH-CONTEXT] Loading auth state from localStorage')
      console.log('[AUTH-CONTEXT] storedUser:', storedUser ? 'Found' : 'Not found')
      console.log('[AUTH-CONTEXT] storedToken:', storedToken ? 'Found' : 'Not found')

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
        console.log('[AUTH-CONTEXT] Auth state loaded successfully')
        console.log('[AUTH-CONTEXT] User:', parsedUser.email)
        console.log('[AUTH-CONTEXT] Role:', parsedUser.role)
      } else {
        console.log('[AUTH-CONTEXT] No auth state in localStorage')
      }
    } catch (error) {
      console.error('[AUTH-CONTEXT] Error loading auth state:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData: User, authToken: string) => {
    console.log('[AUTH-CONTEXT] Login called with user:', userData.email, 'role:', userData.role)
    setUser(userData)
    setToken(authToken)
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
      console.log('[AUTH-CONTEXT] Auth state saved to localStorage')
    } catch (error) {
      console.error('[AUTH-CONTEXT] Error saving auth state:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // Clear session cookie
      document.cookie = 'session=; path=/; max-age=0; samesite=lax'
    } catch (error) {
      console.error('Error clearing auth state:', error)
    }
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
