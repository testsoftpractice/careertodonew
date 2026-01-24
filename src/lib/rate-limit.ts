// Simple in-memory rate limiting for development
// In production, use Redis or a dedicated service

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  limit?: number
  window?: number // in milliseconds
}

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const { limit = 10, window = 60000 } = options // Default: 10 requests per minute
  const now = Date.now()

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, { count: 0, resetTime: now + window })
  }

  const entry = rateLimitMap.get(identifier)!

  if (now > entry.resetTime) {
    // Reset window
    entry.count = 0
    entry.resetTime = now + window
  }

  if (entry.count >= limit) {
    const remainingTime = Math.max(0, entry.resetTime - now)
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

// Cleanup old entries periodically (call this from a cron job or similar)
export function cleanupOldEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}
