import { cookies } from 'next/headers';

export const AFFILIATE_COOKIE_NAME = 'callio_ref';
export const AFFILIATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 days

// Get the current affiliate ref code from cookies
export async function getAffiliateRef(): Promise<string | null> {
  const cookieStore = await cookies();
  const ref = cookieStore.get(AFFILIATE_COOKIE_NAME);
  return ref?.value || null;
}
