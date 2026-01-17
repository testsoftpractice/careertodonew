import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth/jwt'
import { loginSchema } from '@/lib/validations/schemas'
import { z } from 'zod'

// POST /api/auth/login - User authentication with password verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Simple in-memory rate limiter (in production, use Redis)
    const loginAttempts = new Map<string, { count: number, resetTime: number }>()
    const key = `login:${ip}`
    
    // Check rate limit: 5 attempts per 5 minutes
    const now = Date.now()
    const attempts = loginAttempts.get(key)
    
    if (attempts && attempts.count >= 5 && attempts.resetTime > now) {
      // Rate limit exceeded
      const waitTime = Math.ceil((attempts.resetTime - now) / 60000) // Convert to minutes
      return NextResponse.json(
        { 
          error: 'Too many login attempts',
          message: `Please wait ${waitTime} minute${waitTime > 1 ? 's' : ''} before trying again`
        },
        { status: 429 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        university: true,
      },
    })

    if (!user) {
      // Log failed attempt
      if (!attempts) {
        loginAttempts.set(key, { count: 1, resetTime: now + 300000 }) // 5 minutes
      } else {
        loginAttempts.set(key, { count: attempts.count + 1, resetTime: now + 300000 })
      }
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (user.lockedAt && user.lockedAt > new Date()) {
      const waitMinutes = Math.ceil((user.lockedAt.getTime() - Date.now()) / 60000)
      return NextResponse.json(
        {
          error: 'Account temporarily locked',
          message: `Too many failed login attempts. Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} or contact support.`
        },
        { status: 423 }
      )
    }

    // Verify password using bcrypt
    const passwordValid = await verifyPassword(password, user.password as string)

    if (!passwordValid) {
      // Increment login attempts
      const newAttempts = (user.loginAttempts || 0) + 1
      
      // Lock account after 5 failed attempts for 15 minutes
      if (newAttempts >= 5) {
        await db.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: newAttempts,
            lockedAt: new Date(Date.now() + 900000), // Lock for 15 minutes
          },
        })
        
        return NextResponse.json(
          {
            error: 'Account temporarily locked',
            message: 'Too many failed login attempts. Please try again in 15 minutes or contact support.'
          },
          { status: 423 }
        )
      }
      
      await db.user.update({
        where: { id: user.id },
        data: { loginAttempts: newAttempts },
      })
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Login successful - reset attempts and unlock account
    await db.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedAt: null,
        lastPasswordChange: new Date(), // Track when user logged in successfully
      },
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    })

    // Calculate average ratings
    const ratings = await db.rating.findMany({
      where: { ratedId: user.id },
    })

    const avgExecution = ratings.filter(r => r.dimension === 'EXECUTION').reduce((sum, r) => sum + r.score, 0) / (ratings.filter(r => r.dimension === 'EXECUTION').length || 1)
    const avgCollaboration = ratings.filter(r => r.dimension === 'COLLABORATION').reduce((sum, r) => sum + r.score, 0) / (ratings.filter(r => r.dimension === 'COLLABORATION').length || 1)
    const avgLeadership = ratings.filter(r => r.dimension === 'LEADERSHIP').reduce((sum, r) => sum + r.score, 0) / (ratings.filter(r => r.dimension === 'LEADERSHIP').length || 1)
    const avgEthics = ratings.filter(r => r.dimension === 'ETHICS').reduce((sum, r) => sum + r.score, 0) / (ratings.filter(r => r.dimension === 'ETHICS').length || 1)
    const avgReliability = ratings.filter(r => r.dimension === 'RELIABILITY').reduce((sum, r) => sum + r.score, 0) / (ratings.filter(r => r.dimension === 'RELIABILITY').length || 1)

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        verificationStatus: user.verificationStatus,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear,
        progressionLevel: user.progressionLevel,
        reputationScores: {
          execution: avgExecution || user.executionScore,
          collaboration: avgCollaboration || user.collaborationScore,
          leadership: avgLeadership || user.leadershipScore,
          ethics: avgEthics || user.ethicsScore,
          reliability: avgReliability || user.reliabilityScore,
        },
      },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
