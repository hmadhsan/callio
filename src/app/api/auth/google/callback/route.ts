import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';

    if (error) {
      return NextResponse.redirect(`${appUrl}/login?error=google_denied`);
    }

    if (!code) {
      return NextResponse.redirect(`${appUrl}/login?error=no_code`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${appUrl}/login?error=oauth_not_configured`);
    }

    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('Google token exchange failed:', await tokenRes.text());
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    const tokenData: GoogleTokenResponse = await tokenRes.json();

    // Get user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error('Google userinfo failed:', await userInfoRes.text());
      return NextResponse.redirect(`${appUrl}/login?error=userinfo_failed`);
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    // Find existing user by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.sub },
          { email: googleUser.email },
        ],
      },
    });

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.sub,
            name: user.name || googleUser.name || null,
          },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.given_name || null,
          firstName: googleUser.given_name || null,
          lastName: googleUser.family_name || null,
          googleId: googleUser.sub,
          memberships: {
            create: {
              role: 'OWNER',
              workspace: {
                create: {
                  name: 'Personal Workspace',
                  slug: `personal-${googleUser.sub.substring(0, 8)}`,
                }
              }
            }
          }
        },
      });
    }

    // Create session
    const session = await createSession(user.id);

    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    console.error('Google OAuth callback error:', error instanceof Error ? error.message : error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`);
  }
}
