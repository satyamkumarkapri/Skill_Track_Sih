import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { decrypt } from '@/lib/session';

const protectedRoutes = ["/dashboard", "/trainee", "/employer", "/provider"];
const authRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  // Set strict security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // CSP for modern web apps
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();
  
  res.headers.set('Content-Security-Policy', cspHeader);

  // Authentication/Authorization guards
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Get the session from the cookie
  const cookie = req.cookies.get("session")?.value;
  let session = null;
  if (cookie) {
    session = await decrypt(cookie);
  }

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && (!session || !session.userId)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Handle onboarding redirect
  if (session?.userId && session.onboardingCompleted === false && path !== "/onboarding" && !path.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
  }

  // Redirect to dashboard if the user is authenticated and trying to access login/register/onboarding (if complete)
  if ((isAuthRoute || (path === "/onboarding" && session?.onboardingCompleted !== false)) && session?.userId) {
    // Route based on role
    switch (session.role) {
      case "trainee":
        return NextResponse.redirect(new URL("/trainee/dashboard", req.nextUrl));
      case "training_provider":
        return NextResponse.redirect(new URL("/provider/dashboard", req.nextUrl));
      case "employer":
        return NextResponse.redirect(new URL("/employer/dashboard", req.nextUrl));
      default:
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
