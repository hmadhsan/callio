import { createHash, randomBytes } from 'crypto';
import type { ApiKeyEnvironment } from '@prisma/client';

export function generateApiKey(environment: ApiKeyEnvironment = 'production') {
  const suffix = randomBytes(24).toString('hex');
  const raw =
    environment === 'sandbox' ? `callio_test_${suffix}` : `callio_live_${suffix}`;
  const keyHash = createHash('sha256').update(raw).digest('hex');
  const keyLast4 = raw.slice(-4);
  return { raw, keyHash, keyLast4 };
}

export function hashApiKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}
