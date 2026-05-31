import { cache } from 'react';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { Role } from '@prisma/client';

const COOKIE = 'sra_session';

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

let cachedSecret: Uint8Array | null = null;

function secret() {
  if (cachedSecret) return cachedSecret;
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set');
  cachedSecret = new TextEncoder().encode(s);
  return cachedSecret;
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Deduplicated per request — safe to call from layout, navbar, and pages. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: Number(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
});

export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE);
}

export function requireRole(user: SessionUser | null, roles: Role[]): SessionUser {
  if (!user || !roles.includes(user.role)) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
