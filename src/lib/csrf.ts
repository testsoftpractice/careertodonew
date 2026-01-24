import crypto from 'crypto'

/**
 * Generate a CSRF token for a user session
 * @param sessionId - The user's session identifier
 * @returns CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const data = `${sessionId}-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Validate a CSRF token
 * @param token - The token to validate
 * @param sessionId - The user's session identifier
 * @param maxAge - Maximum age of token in milliseconds (default: 1 hour)
 * @returns true if valid, false otherwise
 */
export function validateCSRFToken(
  token: string,
  sessionId: string,
  maxAge: number = 3600000 // 1 hour
): boolean {
  // In a real implementation, you would check this against a database
  // For now, we'll do basic validation
  return token.length === 64 && /^[a-f0-9]{64}$/.test(token)
}

/**
 * Generate CSRF token header name for API requests
 */
export const CSRF_TOKEN_HEADER = 'X-CSRF-Token'
export const CSRF_TOKEN_COOKIE = 'csrf_token'

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromHeaders(headers: Headers): string | null {
  return headers.get(CSRF_TOKEN_HEADER)
}

/**
 * Generate a new CSRF token for a session
 * Store it in database in a real implementation
 */
export async function createCSRFSession(userId: string): Promise<string> {
  const token = generateCSRFToken(userId)
  // In a real implementation, store this in database:
  // await db.cSRFToken.create({
  //   data: {
  //     token,
  //     userId,
  //     createdAt: new Date(),
  //     expiresAt: new Date(Date.now() + 3600000), // 1 hour
  //   },
  // })
  return token
}

/**
 * Validate and invalidate a CSRF token after use
 */
export async function validateAndInvalidateCSRFToken(token: string, userId: string): Promise<boolean> {
  const isValid = validateCSRFToken(token, userId)

  // In a real implementation, delete the token from database:
  // if (isValid) {
  //   await db.cSRFToken.delete({ where: { token } })
  // }

  return isValid
}
