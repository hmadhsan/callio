import { NextRequest } from 'next/server';

/**
 * Public origin used for Google OAuth redirect_uri and post-login redirects.
 * When NEXT_PUBLIC_APP_URL is set, it wins (canonical production URL).
 * Otherwise we infer from the request so local dev and Vercel previews match the URL Google redirects to.
 */
export function getOAuthAppUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '').trim();
  if (fromEnv) return fromEnv;

  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host')?.trim();
  if (host) {
    let proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
    if (!proto) {
      proto = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
    }
    return `${proto}://${host}`;
  }

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercel) return `https://${vercel}`;

  return 'https://callio.dev';
}
