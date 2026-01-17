/**
 * Rate Limiting Utility
 * Provides rate limiting using in-memory storage (can be upgraded to Redis)
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  windowMs?: number
  maxRequests?: number
  keyGenerator?: (identifier: string) => string
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig = {}) {
    this.config = {
      windowMs: 60000, // 1 minute
      maxRequests: 100, // 100 requests per minute
      keyGenerator: (identifier: string) => `rate_limit_${identifier}`,
      ...config,
    }
  }

  /**
   * Check if identifier has exceeded rate limit
   */
  async check(identifier: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    resetTime: Date
  }> {
    const key = this.config.keyGenerator(identifier)
    const now = Date.now()
    
    // Get or create rate limit entry
    let entry = this.store.get(key)
    
    if (!entry) {
      entry = { count: 0, resetTime: now + this.config.windowMs }
      this.store.set(key, entry)
    }
    
    // Reset if window has passed
    if (now > entry.resetTime) {
      entry = { count: 0, resetTime: now + this.config.windowMs }
      this.store.set(key, entry)
    }
    
    // Increment count
    entry.count++
    this.store.set(key, entry)
    
    const remaining = Math.max(0, this.config.maxRequests - entry.count)
    const success = entry.count <= this.config.maxRequests
    
    return {
      success,
      limit: this.config.maxRequests,
      remaining,
      resetTime: new Date(entry.resetTime),
    }
  }

  /**
   * Reset rate limit for identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = this.config.keyGenerator(identifier)
    this.store.delete(key)
  }

  /**
   * Clean up old entries
   */
  async cleanup(): Promise<void> {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * Create rate limiter instance
 */
export function createRateLimiter(config?: RateLimitConfig) {
  return new RateLimiter(config)
}

/**
 * Middleware function for rate limiting API routes
 */
export function rateLimitMiddleware(rateLimiter: RateLimiter, identifierGenerator: (req: any) => string) {
  return async (req: any, res: any, next: any) => {
    try {
      const identifier = identifierGenerator(req)
      const result = await rateLimiter.check(identifier)
      
      if (!result.success) {
        const resetInSeconds = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000)
        
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${resetInSeconds} seconds.`,
          limit: result.limit,
          remaining: result.remaining,
          resetAt: result.resetTime.toISOString(),
        })
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit.toString())
      res.setHeader('X-RateLimit-Remaining', result.remaining.toString())
      res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString())
      
      return next()
    } catch (error) {
      console.error('[Rate Limit Error]:', error)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      })
    }
  }
}
