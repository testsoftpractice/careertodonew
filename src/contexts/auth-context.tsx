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
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error('Error loading auth state:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
    } catch (error) {
      console.error('Error saving auth state:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
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
