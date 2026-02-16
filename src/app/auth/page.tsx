'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import PublicHeader from '@/components/public-header'
import { UniversitySelector } from '@/components/student/university-selector'

export default function AuthPage() {
  const router = useRouter()
  const { login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('signup')
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  // Get redirect URL from query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    console.log('[Auth] Redirect URL from params:', redirect)
    setRedirectUrl(redirect)
  }, [])

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    bio: '',
    agreeTerms: false,
    // Student specific
    university: '',
    universityId: '',
    major: '',
    graduationYear: '',
    // University specific
    universityName: '',
    universityCode: '',
    website: '',
    // Employer specific
    companyName: '',
    companyWebsite: '',
    position: '',
    // Investor specific
    firmName: '',
    investmentFocus: '',
  })

  const [universitySignupMode, setUniversitySignupMode] = useState<'existing' | 'new'>('new')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const roles = [
    { id: 'STUDENT', title: 'Student', color: 'bg-blue-500/10' },
    { id: 'UNIVERSITY', title: 'University', color: 'bg-purple-500/10' },
    { id: 'EMPLOYER', title: 'Employer', color: 'bg-green-500/10' },
    { id: 'INVESTOR', title: 'Investor', color: 'bg-orange-500/10' },
  ]

  const handleSignup = async (e: any) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user, data.token)
        setMessage('Account created successfully! Redirecting...')

        setTimeout(() => {
          if (selectedRole === 'STUDENT') {
            router.push('/dashboard/student')
          } else if (selectedRole === 'UNIVERSITY') {
            router.push('/dashboard/university')
          } else if (selectedRole === 'EMPLOYER') {
            router.push('/dashboard/employer')
          } else if (selectedRole === 'INVESTOR') {
            router.push('/dashboard/investor')
          }
        }, 1000)
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Get redirect URL from current URL at the time of login
    const currentRedirect = new URLSearchParams(window.location.search).get('redirect')
    console.log('[Auth] Login clicked. Current redirect URL:', currentRedirect)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user, data.token)
        setMessage('Login successful! Redirecting...')
        console.log('[Auth] Login successful. User role:', data.user.role)

        setTimeout(() => {
          // If there's a redirect URL, use it. Otherwise, redirect based on role.
          if (currentRedirect) {
            console.log('[Auth] Redirecting to:', currentRedirect)
            window.location.href = currentRedirect
          } else if (data.user.role === 'STUDENT') {
            console.log('[Auth] Redirecting to student dashboard')
            window.location.href = '/dashboard/student'
          } else if (data.user.role === 'UNIVERSITY') {
            console.log('[Auth] Redirecting to university dashboard')
            window.location.href = '/dashboard/university'
          } else if (data.user.role === 'EMPLOYER') {
            console.log('[Auth] Redirecting to employer dashboard')
            window.location.href = '/dashboard/employer'
          } else if (data.user.role === 'INVESTOR') {
            console.log('[Auth] Redirecting to investor dashboard')
            window.location.href = '/dashboard/investor'
          } else if (data.user.role === 'PLATFORM_ADMIN') {
            console.log('[Auth] Redirecting to admin dashboard')
            window.location.href = '/admin'
          }
        }, 500)
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4" role="main">
        <div className="w-full max-w-4xl">
          <div className="w-full max-w-md grid grid-cols-2 mx-auto gap-4" role="tablist">
            <button
              className={`w-full py-2 px-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${activeTab === 'signup' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('signup')}
              disabled={loading}
              role="tab"
              aria-selected={activeTab === 'signup'}
              aria-controls="signup-panel"
              id="signup-tab"
            >
              Sign Up
            </button>
            <button
              className={`w-full py-2 px-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${activeTab === 'login' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('login')}
              disabled={loading}
              role="tab"
              aria-selected={activeTab === 'login'}
              aria-controls="login-panel"
              id="login-tab"
            >
              Login
            </button>
          </div>

          {activeTab === 'signup' && (
            <div className="w-full mt-8 p-6 border rounded-lg shadow-lg" role="tabpanel" id="signup-panel" aria-labelledby="signup-tab">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
                  <p className="text-sm text-muted-foreground text-center">Choose your role and join execution platform</p>
                </div>

                {error && (
                  <div className={`p-4 rounded-lg border ${error.includes('success') || error.includes('created') || error.includes('Redirecting') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`} role="alert" aria-live="polite">
                    <div className="text-center font-medium">{error}</div>
                  </div>
                )}

                <div>
                  <label className="text-base font-semibold block mb-2">I am a...</label>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id)
                          setSignupData({ ...signupData, role: role.id })
                        }}
                        disabled={loading}
                        className={`relative p-4 rounded-lg border-2 transition-all ${selectedRole === role.id ? `${role.color} border-current` : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        {selectedRole === role.id && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">Selected</span>
                        )}
                        <div className="h-8 w-8 mx-auto mb-2 bg-blue-500 rounded-full"></div>
                        <div className="font-semibold">{role.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRole && (
                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Common Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={signupData.lastName}
                          onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        disabled={loading}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mobileNumber" className="block text-sm font-medium mb-2">Mobile Number</label>
                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={signupData.mobileNumber}
                        onChange={(e) => setSignupData({ ...signupData, mobileNumber: e.target.value })}
                        disabled={loading}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Role-specific Fields */}
                    {selectedRole === 'STUDENT' && (
                      <>
                        <div className="space-y-4">
                          <UniversitySelector
                            value={selectedUniversity?.id || null}
                            onChange={(university) => {
                              setSelectedUniversity(university)
                              setSignupData({
                                ...signupData,
                                university: university?.name || '',
                                universityId: university?.id || '',
                              })
                            }}
                            disabled={loading}
                            label="University"
                            placeholder="Search and select your university..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="major" className="block text-sm font-medium mb-2">Major</label>
                          <input
                            id="major"
                            name="major"
                            type="text"
                            placeholder="e.g., Computer Science"
                            value={signupData.major}
                            onChange={(e) => setSignupData({ ...signupData, major: e.target.value })}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="graduationYear" className="block text-sm font-medium mb-2">Graduation Year</label>
                          <select
                            id="graduationYear"
                            name="graduationYear"
                            value={signupData.graduationYear}
                            onChange={(e) => setSignupData({ ...signupData, graduationYear: e.target.value })}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border rounded-md"
                          >
                            <option value="">Select year</option>
                            {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {selectedRole === 'UNIVERSITY' && (
                      <>
                        <div className="space-y-4">
                          <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setUniversitySignupMode('existing')
                                setSelectedUniversity(null)
                              }}
                              disabled={loading}
                              className={`flex-1 py-2 px-4 rounded-md transition-all ${universitySignupMode === 'existing' ? 'bg-white dark:bg-gray-700 shadow font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                              Join Existing University
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUniversitySignupMode('new')
                                setSelectedUniversity(null)
                              }}
                              disabled={loading}
                              className={`flex-1 py-2 px-4 rounded-md transition-all ${universitySignupMode === 'new' ? 'bg-white dark:bg-gray-700 shadow font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                              Create New University
                            </button>
                          </div>

                          {universitySignupMode === 'existing' ? (
                            <UniversitySelector
                              value={selectedUniversity?.id || null}
                              onChange={(university) => {
                                setSelectedUniversity(university)
                                setSignupData({
                                  ...signupData,
                                  universityName: university?.name || '',
                                  universityId: university?.id || '',
                                  universityCode: university?.code || '',
                                  website: university?.website || '',
                                })
                              }}
                              disabled={loading}
                              label="Select University"
                              placeholder="Search and select your university to join..."
                              showWebsite={false}
                            />
                          ) : (
                            <>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <label htmlFor="universityName" className="block text-sm font-medium mb-2">University Name</label>
                                  <input
                                    id="universityName"
                                    name="universityName"
                                    type="text"
                                    placeholder="e.g., Stanford University"
                                    value={signupData.universityName}
                                    onChange={(e) => setSignupData({ ...signupData, universityName: e.target.value })}
                                    disabled={loading}
                                    required={universitySignupMode === 'new'}
                                    className="w-full px-4 py-2 border rounded-md"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="universityCode" className="block text-sm font-medium mb-2">University Code</label>
                                  <input
                                    id="universityCode"
                                    name="universityCode"
                                    type="text"
                                    placeholder="e.g., STAN"
                                    value={signupData.universityCode}
                                    onChange={(e) => setSignupData({ ...signupData, universityCode: e.target.value })}
                                    disabled={loading}
                                    required={universitySignupMode === 'new'}
                                    className="w-full px-4 py-2 border rounded-md"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="website" className="block text-sm font-medium mb-2">Website</label>
                                <input
                                  id="website"
                                  name="website"
                                  type="url"
                                  placeholder="https://university.edu"
                                  value={signupData.website}
                                  onChange={(e) => setSignupData({ ...signupData, website: e.target.value })}
                                  disabled={loading}
                                  className="w-full px-4 py-2 border rounded-md"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {selectedRole === 'EMPLOYER' && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="companyName" className="block text-sm font-medium mb-2">Company Name</label>
                          <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            placeholder="e.g., Tech Corp"
                            value={signupData.companyName}
                            onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label htmlFor="position" className="block text-sm font-medium mb-2">Position</label>
                            <input
                              id="position"
                              name="position"
                              type="text"
                              placeholder="e.g., Hiring Manager"
                              value={signupData.position}
                              onChange={(e) => setSignupData({ ...signupData, position: e.target.value })}
                              disabled={loading}
                              required
                              className="w-full px-4 py-2 border rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="companyWebsite" className="block text-sm font-medium mb-2">Company Website</label>
                            <input
                              id="companyWebsite"
                              name="companyWebsite"
                              type="url"
                              placeholder="https://company.com"
                              value={signupData.companyWebsite}
                              onChange={(e) => setSignupData({ ...signupData, companyWebsite: e.target.value })}
                              disabled={loading}
                              className="w-full px-4 py-2 border rounded-md"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedRole === 'INVESTOR' && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="firmName" className="block text-sm font-medium mb-2">Firm Name</label>
                          <input
                            id="firmName"
                            name="firmName"
                            type="text"
                            placeholder="e.g., Venture Capital Partners"
                            value={signupData.firmName}
                            onChange={(e) => setSignupData({ ...signupData, firmName: e.target.value })}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="investmentFocus" className="block text-sm font-medium mb-2">Investment Focus</label>
                          <select
                            id="investmentFocus"
                            name="investmentFocus"
                            value={signupData.investmentFocus}
                            onChange={(e) => setSignupData({ ...signupData, investmentFocus: e.target.value })}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border rounded-md"
                          >
                            <option value="">Select focus</option>
                            <option value="Early Stage">Early Stage</option>
                            <option value="Growth Stage">Growth Stage</option>
                            <option value="EdTech">EdTech</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Consumer">Consumer</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Password Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Create a strong password (min 8 characters)"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium mb-2">About {selectedRole === 'STUDENT' ? 'Yourself' : selectedRole === 'UNIVERSITY' ? 'Your University' : selectedRole === 'EMPLOYER' ? 'Your Company' : 'Your Firm'} (Optional)</label>
                      <textarea
                        id="bio"
                        name="bio"
                        placeholder={`Tell us about ${selectedRole === 'STUDENT' ? 'your academic goals and interests...' : selectedRole === 'UNIVERSITY' ? 'your university and programs...' : selectedRole === 'EMPLOYER' ? 'your company and hiring needs...' : 'your investment strategy...'}`}
                        rows={3}
                        value={signupData.bio}
                        onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })}
                        disabled={loading}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          id="terms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={signupData.agreeTerms}
                          onChange={(e) => setSignupData({ ...signupData, agreeTerms: e.target.checked })}
                          disabled={loading}
                          required
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-muted-foreground">
                          I agree to{' '}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </a>
                          {' '}
                          and{' '}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="w-full mt-8 p-6 border rounded-lg shadow-lg" role="tabpanel" id="login-panel" aria-labelledby="login-tab">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
                  <p className="text-sm text-muted-foreground text-center">Sign in to access your account</p>
                </div>

                {error && (
                  <div className={`p-4 rounded-lg border mb-4 ${error.includes('success') || error.includes('Login') || error.includes('Redirecting') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`} role="alert" aria-live="polite">
                    <div className="text-center font-medium">{error}</div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="loginEmail" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      id="loginEmail"
                      name="loginEmail"
                      type="email"
                      placeholder="demo@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="loginPassword" className="block text-sm font-medium mb-2">Password</label>
                    <input
                      id="loginPassword"
                      name="loginPassword"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center text-sm text-muted-foreground mt-2">
                    <a href="/auth/forgot-password" className="hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
