let cachedSecret: Uint8Array | null = null;

export function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('no secret');
  cachedSecret = new TextEncoder().encode(s);
  return cachedSecret;
}

function base64UrlToBytes(b64: string): Uint8Array {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Edge-safe JWT verify (HS256) — no jose import in middleware. */
export async function verifySessionToken(
  token: string,
  secret: Uint8Array
): Promise<{ role: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  const key = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToBytes(sigB64);

  const valid = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64))) as {
      role?: string;
      exp?: number;
    };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    if (!payload.role) return null;
    return { role: String(payload.role) };
  } catch {
    return null;
  }
}
