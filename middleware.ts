import type { NextRequest } from 'next/server'
import { gatewayAuthMiddleware } from '.src/lib/api/auth-middleware'

export function middleware(request: NextRequest) {
  return gatewayAuthMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}