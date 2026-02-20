// 👇 ADD THIS AT THE BOTTOM — do not remove anything above

const PUBLIC_PATH_PREFIXES = [
  '/about',
  '/features',
  '/solutions',
  '/contact',
  '/terms',
  '/privacy',
  '/auth',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some(
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
  )
}

/**
 * Gateway middleware
 * - Public by exception
 * - Everything else requires auth
 * - Runs BEFORE Vercel rewrites
 */
export function gatewayAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🚫 Ignore Next.js internals & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // images, favicon, etc
  ) {
    return NextResponse.next()
  }

  // ✅ Public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 🔐 Protected routes
  const user = getUserFromRequest(request)

  if (!user) {
    // Browser navigation → redirect
    if (request.headers.get('accept')?.includes('text/html')) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // API / fetch
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Optional: forward user context
  const response = NextResponse.next()
  response.headers.set('x-user-id', user.sub)
  response.headers.set('x-user-role', user.role ?? '')

  return response
}