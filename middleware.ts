import { gatewayAuthMiddleware } from '@/lib/middleware/auth-middleware'

/**
 * Next.js Middleware
 *
 * This file runs in Edge Runtime.
 * It delegates authentication logic to the auth-middleware which uses
 * Edge-safe JWT verification (jose instead of jsonwebtoken).
 */
export async function middleware(request: Request) {
  return gatewayAuthMiddleware(request as any)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately by auth-middleware)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
