import { createHash, randomBytes } from 'crypto';

export function generateApiKey() {
  const raw = `callio_${randomBytes(24).toString('hex')}`;
  const keyHash = createHash('sha256').update(raw).digest('hex');
  const keyLast4 = raw.slice(-4);
  return { raw, keyHash, keyLast4 };
}

export function hashApiKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}
