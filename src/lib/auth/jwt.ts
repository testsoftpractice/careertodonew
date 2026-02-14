import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Use a default JWT_SECRET for development if not set
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-123456789'

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET environment variable is not set, using default for development')
}

const JWT_EXPIRES_IN = '7d' // 7 days for access token
const REFRESH_TOKEN_EXPIRES_IN = '30d' // 30 days for refresh token

export interface JwtPayload {
  userId: string
  email: string
  role: string
  verificationStatus?: string
  iat?: number
  exp?: number
  // Extended properties for API routes
  user?: {
    id: string
    email: string
    role: string
    name?: string
    universityId?: string | null
  }
  id?: string
  name?: string
  universityId?: string | null
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })
}

// Backward compatibility
export function generateToken(payload: any): string {
  return generateAccessToken(payload)
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
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
