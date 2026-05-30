import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE = 'sra_session';

const roleRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/hr': ['hr'],
  '/candidate': ['candidate'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPrefix = Object.keys(roleRoutes).find((p) => pathname.startsWith(p));
  if (!protectedPrefix) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error('no secret');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = String(payload.role);
    const allowed = roleRoutes[protectedPrefix];
    if (!allowed.includes(role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/hr/:path*', '/candidate/:path*'],
};
