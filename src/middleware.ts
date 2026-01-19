import { NextRequest, NextResponse } from 'next/server'

// ⚠️ AUTHENTICATION DISABLED FOR TESTING
// All pages and APIs are now publicly accessible
// No login/signup required

export function middleware(request: NextRequest) {
  // Allow everything - no authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
