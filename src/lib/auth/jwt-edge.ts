import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // 7 days

// Debug: Log JWT_SECRET status
if (process.env.NODE_ENV === 'production') {
  console.log('[JWT] Production mode - JWT_SECRET set:', !!JWT_SECRET)
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
    console.error('[JWT] CRITICAL: JWT_SECRET not set in production! Using fallback!')
  }
} else {
  console.log('[JWT] Development mode - JWT_SECRET set:', !!JWT_SECRET)
  console.log('[JWT] JWT_SECRET first 8 chars:', JWT_SECRET?.substring(0, 8) || 'NOT SET')
}

export function generateToken(payload: any): string {
  console.log('[JWT] Generating token for payload:', { userId: payload.userId, email: payload.email, role: payload.role })
  console.log('[JWT] Using algorithm: HS256')
  console.log('[JWT] JWT_SECRET first 8 chars:', JWT_SECRET?.substring(0, 8) || 'NOT SET')

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256', // Explicitly specify algorithm to match jwt.ts
  })

  console.log('[JWT] Token generated successfully, first 50 chars:', token?.substring(0, 50))
  return token
}

export function verifyToken(token: string): any {
  console.log('[JWT] Attempting to verify token...')
  console.log('[JWT] Token first 50 chars:', token?.substring(0, 50))
  console.log('[JWT] JWT_SECRET being used:', JWT_SECRET?.substring(0, 8) || 'NOT SET')

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('[JWT] Token verification SUCCESS:', !!decoded)
    if (decoded) {
      console.log('[JWT] Decoded payload:', { userId: decoded.userId, email: decoded.email, role: decoded.role })
    }
    return decoded
  } catch (error) {
    console.error('[JWT] Token verification FAILED:', error)
    console.error('[JWT] Error message:', error instanceof Error ? error.message : String(error))
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
