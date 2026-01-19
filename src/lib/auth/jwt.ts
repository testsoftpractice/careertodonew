import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d' // 7 days

// Debug: Log JWT_SECRET status
if (process.env.NODE_ENV === 'production') {
  console.log('[JWT-API] Production mode - JWT_SECRET set:', !!JWT_SECRET)
  if (!JWT_SECRET) {
    console.error('[JWT-API] CRITICAL: JWT_SECRET not set in production!')
  } else {
    console.log('[JWT-API] JWT_SECRET first 8 chars:', JWT_SECRET?.substring(0, 8))
  }
} else {
  console.log('[JWT-API] Development mode - JWT_SECRET set:', !!JWT_SECRET)
  console.log('[JWT-API] JWT_SECRET first 8 chars:', JWT_SECRET?.substring(0, 8) || 'NOT SET')
}

if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET must be set in environment variables. This is a security risk.')
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12) // Increased to 12 for security
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: any): string {
  console.log('[JWT-API] Generating token for payload:', { userId: payload.userId, email: payload.email, role: payload.role })
  console.log('[JWT-API] Using algorithm: HS256')
  console.log('[JWT-API] JWT_SECRET first 8 chars:', JWT_SECRET?.substring(0, 8) || 'NOT SET')

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256', // Explicitly specify algorithm
  })

  console.log('[JWT-API] Token generated successfully, first 50 chars:', token?.substring(0, 50))
  return token
}

export function verifyToken(token: string): any {
  console.log('[JWT-API] Attempting to verify token...')
  console.log('[JWT-API] Token first 50 chars:', token?.substring(0, 50))
  console.log('[JWT-API] JWT_SECRET being used:', JWT_SECRET?.substring(0, 8) || 'NOT SET')

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('[JWT-API] Token verification SUCCESS:', !!decoded)
    if (decoded) {
      console.log('[JWT-API] Decoded payload:', { userId: decoded.userId, email: decoded.email, role: decoded.role })
    }
    return decoded
  } catch (error) {
    console.error('[JWT-API] Token verification FAILED:', error)
    console.error('[JWT-API] Error message:', error instanceof Error ? error.message : String(error))
    return null
  }
}

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization')
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}
