'use client'

import { createContext, useContext, useState, useEffect } from 'react'
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
  createdAt?: Date
  updatedAt?: Date
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, authToken: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for different roles when auth is disabled
const demoStudent: User = {
  id: 'demo-student',
  email: 'student@careertodo.com',
  name: 'Alex Johnson',
  role: 'STUDENT',
  universityId: 'demo-university',
  university: {
    id: 'demo-university',
    name: 'Demo University',
    code: 'DEMO-UNI',
    description: 'Demo university for testing',
    location: 'Berkeley, CA',
  },
  verificationStatus: 'VERIFIED',
  bio: 'Computer Science student passionate about building innovative projects',
  avatar: 'https://api.dicebear.com/7.x/alex-johnson/svg',
  location: 'San Francisco, CA',
  progressionLevel: 'CONTRIBUTOR',
  executionScore: 4.2,
  collaborationScore: 4.5,
  leadershipScore: 3.8,
  ethicsScore: 4.7,
  reliabilityScore: 4.3,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const demoUniversityAdmin: User = {
  id: 'demo-university-admin',
  email: 'university@careertodo.com',
  name: 'Dr. Sarah Martinez',
  role: 'UNIVERSITY_ADMIN',
  universityId: 'demo-university',
  university: {
    id: 'demo-university',
    name: 'Demo University',
    code: 'DEMO-UNI',
    description: 'Demo university for testing',
    location: 'Berkeley, CA',
  },
  verificationStatus: 'VERIFIED',
  bio: 'University administrator for testing',
  avatar: 'https://api.dicebear.com/7.x/sarah-martinez/svg',
  location: 'Berkeley, CA',
  progressionLevel: 'DEPARTMENT_HEAD',
  executionScore: 4.8,
  collaborationScore: 4.9,
  leadershipScore: 5.0,
  ethicsScore: 5.0,
  reliabilityScore: 4.8,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const demoEmployer: User = {
  id: 'demo-employer',
  email: 'employer@careertodo.com',
  name: 'Tech Ventures Inc.',
  role: 'EMPLOYER',
  companyName: 'Tech Ventures Inc.',
  companyWebsite: 'https://techventures.com',
  position: 'Talent Acquisition Manager',
  avatar: 'https://api.dicebear.com/7.x/techventures/svg',
  location: 'San Jose, CA',
  linkedinUrl: 'https://linkedin.com/company/techventures',
  portfolioUrl: 'https://techventures.com',
  verificationStatus: 'VERIFIED',
  bio: 'Innovation-focused company looking for talented students to join our team',
  progressionLevel: 'TEAM_LEAD',
  executionScore: 4.5,
  collaborationScore: 4.2,
  leadershipScore: 4.4,
  ethicsScore: 4.6,
  reliabilityScore: 4.3,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const demoInvestor: User = {
  id: 'demo-investor',
  email: 'investor@careertodo.com',
  name: 'Apex Ventures',
  role: 'INVESTOR',
  firmName: 'Apex Ventures',
  investmentFocus: 'Technology, SaaS, EdTech',
  avatar: 'https://api.dicebear.com/7.x/apexventures/svg',
  location: 'Palo Alto, CA',
  linkedinUrl: 'https://linkedin.com/company/apexventures',
  verificationStatus: 'VERIFIED',
  bio: 'Early-stage venture capital firm investing in student-led startups',
  progressionLevel: 'PROJECT_LEAD',
  executionScore: 4.7,
  collaborationScore: 4.8,
  leadershipScore: 5.0,
  ethicsScore: 4.9,
  reliabilityScore: 4.6,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const demoMentor: User = {
  id: 'demo-mentor',
  email: 'mentor@careertodo.com',
  name: 'James Chen',
  role: 'MENTOR',
  bio: 'Tech industry veteran with 15+ years of experience mentoring young entrepreneurs',
  avatar: 'https://api.dicebear.com/7.x/jameschen/svg',
  location: 'San Francisco, CA',
  linkedinUrl: 'https://linkedin.com/in/jameschen',
  portfolioUrl: 'https://jameschen.dev',
  verificationStatus: 'VERIFIED',
  progressionLevel: 'TEAM_LEAD',
  executionScore: 5.0,
  collaborationScore: 4.8,
  leadershipScore: 5.0,
  ethicsScore: 5.0,
  reliabilityScore: 4.9,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const demoPlatformAdmin: User = {
  id: 'demo-platform-admin',
  email: 'admin@careertodo.com',
  name: 'Platform Administrator',
  role: 'PLATFORM_ADMIN',
  verificationStatus: 'VERIFIED',
  bio: 'Platform administrator with full access to all features',
  avatar: 'https://api.dicebear.com/7.x/platform-admin/svg',
  location: 'San Francisco, CA',
  progressionLevel: 'PROJECT_LEAD',
  executionScore: 5.0,
  collaborationScore: 5.0,
  leadershipScore: 5.0,
  ethicsScore: 5.0,
  reliabilityScore: 5.0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load auth state from localStorage on mount - validate token with server
  useEffect(() => {
    async function loadAuthState() {
      try {
        const storedUser = localStorage.getItem('user')
        const authHeader = localStorage.getItem('token')

        if (storedUser) {
          const userData = JSON.parse(storedUser)

          // Validate token with server
          try {
            const response = await fetch('/api/auth/validate', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authHeader}`,
              },
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success && data.valid) {
                setUser(data.user)
                setToken(authHeader || '')
              } else {
                // Invalid token - clear auth state
                console.log('[Auth] Token invalid, clearing state')
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                setUser(null)
                setToken(null)
              }
            }
          } catch (error) {
            console.error('[Auth] Error validating token:', error)
            // On validation error, clear state
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            setUser(null)
            setToken(null)
          }
        } else {
          // No user in localStorage
          console.log('[Auth] No user in localStorage')
        }
      } catch (error) {
        console.error('[Auth] Error loading auth state:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAuthState()
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
    } catch (error) {
      console.error('[Auth] Error saving auth state:', error)
    }
  }

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', { method: 'POST' })

      // Clear client-side state
      setUser(null)
      setToken(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      console.log('[Auth] Logged out successfully')
    } catch (error) {
      console.error('[Auth] Error during logout:', error)

      // Still clear local state even if API call fails
      setUser(null)
      setToken(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }

    // Force page reload to ensure clean state
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
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
