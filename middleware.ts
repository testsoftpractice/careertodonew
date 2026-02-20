import type { NextRequest } from 'next/server'
import { gatewayAuthMiddleware } from './src/lib/api/auth-middleware'

export function middleware(request: NextRequest) {
  return gatewayAuthMiddleware(request)
}