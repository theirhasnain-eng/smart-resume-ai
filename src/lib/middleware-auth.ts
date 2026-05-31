let cachedSecret: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('no secret');
  cachedSecret = new TextEncoder().encode(s);
  return cachedSecret;
}
