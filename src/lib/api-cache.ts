import { NextResponse } from 'next/server'

/**
 * Cache configuration constants
 */
export const CACHE_DURATIONS = {
  SHORT: { sMaxAge: 10, staleWhileRevalidate: 30 },
  MEDIUM: { sMaxAge: 30, staleWhileRevalidate: 60 },
  LONG: { sMaxAge: 60, staleWhileRevalidate: 300 },
  PRIVATE: { sMaxAge: 30, staleWhileRevalidate: 60 },
  NO_CACHE: { sMaxAge: 0, staleWhileRevalidate: 0 },
} as const

type CacheDurationKey = keyof typeof CACHE_DURATIONS

/**
 * Add caching headers to API response
 */
export function addCacheHeaders(
  response: NextResponse,
  duration: CacheDurationKey = 'MEDIUM',
  isPrivate = false
): NextResponse {
  const config = CACHE_DURATIONS[duration]

  const cacheControl = isPrivate
    ? `private, s-maxage=${config.sMaxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`
    : `public, s-maxage=${config.sMaxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`

  response.headers.set('Cache-Control', cacheControl)
  return response
}

/**
 * Create a cached API response
 */
export function cachedResponse<T>(
  data: T,
  duration: CacheDurationKey = 'MEDIUM',
  isPrivate = false,
  message?: string
): NextResponse {
  const response = NextResponse.json({
    success: true,
    data,
    message,
  })

  return addCacheHeaders(response, duration, isPrivate)
}

/**
 * Create a no-cache response for dynamic data
 */
export function noCacheResponse<T>(
  data: T,
  message?: string
): NextResponse {
  const response = NextResponse.json({
    success: true,
    data,
    message,
  })

  return addCacheHeaders(response, 'NO_CACHE')
}

/**
 * Add revalidation tag to response
 */
export function withRevalidationTag(
  response: NextResponse,
  tag: string
): NextResponse {
  response.headers.set('Cache-Tag', tag)
  return response
}

/**
 * Create a revalidatable response
 */
export function revalidatableResponse<T>(
  data: T,
  tag: string,
  message?: string,
  duration: CacheDurationKey = 'MEDIUM'
): NextResponse {
  const response = NextResponse.json({
    success: true,
    data,
    message,
  })

  addCacheHeaders(response, duration)
  return withRevalidationTag(response, tag)
}
