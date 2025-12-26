import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js routing
 * 
 * Note: Since we're using localStorage for admin_token, authentication
 * checks are handled client-side in:
 * - ProtectedRoute component (for dashboard pages)
 * - Login page (redirect if already authenticated)
 * - Root page (initial routing)
 * 
 * Server-side middleware cannot access localStorage, so this is minimal.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};