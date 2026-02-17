import { NextRequest, NextResponse } from 'next/server';
import { clearSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  await clearSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
