import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Google OAuth configuration
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleRedirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

  if (!googleClientId) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
  }

  // Build Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', googleClientId);
  googleAuthUrl.searchParams.set('redirect_uri', googleRedirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}
