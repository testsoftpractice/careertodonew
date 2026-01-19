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

  // Load auth state from localStorage on mount - prevent SSR access
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } else {
        // No authentication - load demo user based on path
        console.log('[Auth] No user in localStorage, loading demo user...')

        const path = window.location.pathname

        let demoUser = demoStudent

        if (path.startsWith('/dashboard/university')) {
          console.log('[Auth] Loading demo university admin user')
          demoUser = demoUniversityAdmin
        } else if (path.startsWith('/dashboard/student')) {
          console.log('[Auth] Loading demo student user')
          demoUser = demoStudent
        } else if (path.startsWith('/dashboard/employer')) {
          console.log('[Auth] Loading demo employer user')
          demoUser = demoEmployer
        } else if (path.startsWith('/dashboard/investor')) {
          console.log('[Auth] Loading demo investor user')
          demoUser = demoInvestor
        } else if (path.startsWith('/admin')) {
          console.log('[Auth] Loading demo platform admin user')
          demoUser = demoPlatformAdmin
        } else {
          console.log('[Auth] Loading demo student user as default')
          demoUser = demoStudent
        }

        setUser(demoUser)
        setToken('demo-token')

        // Save to localStorage so it persists
        localStorage.setItem('user', JSON.stringify(demoUser))
        localStorage.setItem('token', 'demo-token')
      }
    } catch (error) {
      console.error('[Auth] Error loading auth state:', error)
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
      console.error('[Auth] Error saving auth state:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('[Auth] Error clearing auth state:', error)
    }
    router.push('/')
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
