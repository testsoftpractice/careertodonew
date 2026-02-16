import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple in-memory rate limiter for development
// In production, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string
}

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, identifier: string = getClientIP(request)) => {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up expired entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }

    // Get current rate limit data
    const current = rateLimitStore.get(identifier) || { count: 0, resetTime: now + config.windowMs }

    // Reset if window has passed
    if (current.resetTime < now) {
      current.count = 0
      current.resetTime = now + config.windowMs
    }

    // Increment count
    current.count++
    rateLimitStore.set(identifier, current)

    // Check if exceeded
    if (current.count > config.maxRequests) {
      const resetIn = Math.ceil((current.resetTime - now) / 1000)
      
      // Log rate limit violation for security monitoring
      console.warn(`[RATE_LIMIT] Exceeded: ${identifier} - ${current.count}/${config.maxRequests}`)
      
      return NextResponse.json(
        { 
          success: false, 
          error: config.message || 'Too many requests',
          retryAfter: resetIn
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString(),
            'Retry-After': resetIn.toString()
          }
        }
      )
    }

    // Add rate limit headers to successful responses
    const headers = {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.maxRequests - current.count).toString(),
      'X-RateLimit-Reset': current.resetTime.toString()
    }

    return null // Success, no rate limit exceeded
  }
}

function getClientIP(request: NextRequest): string {
  // Try various headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (clientIP) {
    return clientIP
  }
  
  // Fallback to request IP
  return request.ip || 'unknown'
}

// Predefined rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later'
})

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Rate limit exceeded, please try again later'
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Too many requests, please slow down'
})