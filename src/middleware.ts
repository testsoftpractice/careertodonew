import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCSRFTokenFromHeaders, CSRF_TOKEN_HEADER } from '@/lib/csrf'

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const pathname = request.nextUrl.pathname
  const method = request.method

  // Rate limit auth endpoints
  if (pathname.startsWith('/api/auth/login')) {
    const result = await checkRateLimit(`login:${ip}`, {
      limit: 5,
      window: 60000, // 5 attempts per minute
    })

    if (!result.allowed) {
      const remainingSeconds = Math.ceil((result.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: remainingSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(remainingSeconds),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(Math.floor(result.resetTime / 1000)),
          },
        }
      )
    }
  }

  if (pathname.startsWith('/api/auth/signup')) {
    const result = await checkRateLimit(`signup:${ip}`, {
      limit: 3,
      window: 3600000, // 3 attempts per hour
    })

    if (!result.allowed) {
      const remainingSeconds = Math.ceil((result.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: 'Too many signup attempts. Please try again later.',
          retryAfter: remainingSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(remainingSeconds),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(Math.floor(result.resetTime / 1000)),
          },
        }
      )
    }
  }

  // CSRF protection for state-changing requests
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // Skip CSRF for auth endpoints (they have their own validation)
    const isAuthEndpoint = pathname.startsWith('/api/auth/')

    if (!isAuthEndpoint) {
      const csrfToken = getCSRFTokenFromHeaders(request.headers)

      if (!csrfToken) {
        return NextResponse.json(
          {
            error: 'CSRF token is required. Please refresh the page and try again.',
            requireCSRFToken: true,
          },
          { status: 403 }
        )
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-DNS-Prefetch-Control', 'on')
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
