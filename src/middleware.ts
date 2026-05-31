import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSecret } from '@/lib/middleware-auth';

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
    const { payload } = await jwtVerify(token, getSecret());
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
