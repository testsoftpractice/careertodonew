'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import PublicHeader from '@/components/public-header'

export default function AuthPage() {
  const router = useRouter()
  const { login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('signup')
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
            router.push('/marketplace')
          } else if (selectedRole === 'INVESTOR') {
            router.push('/marketplace')
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

        setTimeout(() => {
          if (data.user.role === 'STUDENT') {
            router.push('/dashboard/student')
          } else if (data.user.role === 'UNIVERSITY') {
            router.push('/dashboard/university')
          } else if (data.user.role === 'EMPLOYER') {
            router.push('/marketplace')
          } else if (data.user.role === 'INVESTOR') {
            router.push('/marketplace')
          } else if (data.user.role === 'ADMIN') {
            router.push('/admin/governance')
          }
        }, 1000)
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

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="w-full max-w-md grid grid-cols-2 mx-auto gap-4">
            <button
              className={`w-full py-2 px-4 rounded-lg border-2 transition-all ${activeTab === 'signup' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('signup')}
              disabled={loading}
            >
              Sign Up
            </button>
            <button
              className={`w-full py-2 px-4 rounded-lg border-2 transition-all ${activeTab === 'login' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('login')}
              disabled={loading}
            >
              Login
            </button>
          </div>

          {activeTab === 'signup' && (
            <div className="w-full mt-8 p-6 border rounded-lg shadow-lg">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
                  <p className="text-sm text-muted-foreground text-center">Choose your role and join execution platform</p>
                </div>

                {error && (
                  <div className={`p-4 rounded-lg border ${error.includes('success') || error.includes('created') || error.includes('Redirecting') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
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

                    {/* Role-specific Fields */}
                    {selectedRole === 'STUDENT' && (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label htmlFor="university" className="block text-sm font-medium mb-2">University</label>
                            <input
                              id="university"
                              name="university"
                              type="text"
                              placeholder="e.g., Stanford University"
                              value={signupData.university}
                              onChange={(e) => setSignupData({ ...signupData, university: e.target.value })}
                              disabled={loading}
                              required
                              className="w-full px-4 py-2 border rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="universityId" className="block text-sm font-medium mb-2">University ID</label>
                            <input
                              id="universityId"
                              name="universityId"
                              type="text"
                              placeholder="e.g., STAN001"
                              value={signupData.universityId}
                              onChange={(e) => setSignupData({ ...signupData, universityId: e.target.value })}
                              disabled={loading}
                              required
                              className="w-full px-4 py-2 border rounded-md"
                            />
                          </div>
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
                              required
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
                              required
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
            <div className="w-full mt-8 p-6 border rounded-lg shadow-lg">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
                  <p className="text-sm text-muted-foreground text-center">Sign in to access your account</p>
                </div>

                {error && (
                  <div className={`p-4 rounded-lg border mb-4 ${error.includes('success') || error.includes('Login') || error.includes('Redirecting') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
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
