import type { NextRequest } from 'next/server'
import { gatewayAuthMiddleware } from './src/lib/middleware/auth-middleware'

export function middleware(request: NextRequest) {
  return gatewayAuthMiddleware(request)
}

// Configure which routes the middleware runs on
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
