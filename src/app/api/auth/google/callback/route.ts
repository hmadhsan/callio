import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no-code', request.url));
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    if (!googleClientId || !googleClientSecret) {
      return NextResponse.redirect(new URL('/login?error=oauth-not-configured', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=token-exchange-failed', request.url));
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=userinfo-failed', request.url));
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { email: googleUser.email.toLowerCase() },
      update: {
        googleId: googleUser.id,
        name: googleUser.name,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
      },
      create: {
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.id,
        name: googleUser.name,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
      },
    });

    // Create session
    const session = await createSession(user.id);

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.redirect(new URL(`/login?error=oauth-failed&details=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
