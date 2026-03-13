import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware to avoid Turbopack issues
export function middleware(request: NextRequest) {
  // Allow all requests for now - authentication is handled at the route level
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
