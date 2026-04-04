import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { getOAuthAppUrl } from '@/lib/oauth-app-url';
import { Resend } from 'resend';

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
    const appUrl = getOAuthAppUrl(request);

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
      const errText = await tokenRes.text();
      console.error('Google token exchange failed:', errText);
      try {
        const j = JSON.parse(errText) as { error?: string };
        if (j.error === 'invalid_grant') {
          return NextResponse.redirect(`${appUrl}/login?error=invalid_grant`);
        }
        if (j.error === 'redirect_uri_mismatch') {
          return NextResponse.redirect(`${appUrl}/login?error=redirect_uri_mismatch`);
        }
      } catch {
        /* not JSON */
      }
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
                  slug: `personal-${googleUser.sub.replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 64)}`,
                }
              }
            }
          }
        },
      });

      // Send Onboarding Email for new Google signups
      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
      let fromEmail = process.env.RESEND_FROM_ONBOARDING || 'onboarding@callio.dev';
      fromEmail = fromEmail.replace(/["']/g, '').trim();

      if (resend) {
        console.log(`Sending onboarding email from ${fromEmail} to ${googleUser.email}`);
        const { error: resendError } = await resend.emails.send({
          from: `Callio <${fromEmail}>`,
          to: googleUser.email,
          subject: `Welcome to Callio! 🚀`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #000;">Welcome to Callio!</h2>
              <p>Hi ${user.name || googleUser.given_name || 'there'},</p>
              <p>Thanks for creating an account on Callio. We're excited to have you on board!</p>
              <div style="margin: 30px 0;">
                  <a href="${appUrl}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to your Dashboard</a>
              </div>
              <p>If you have any questions, just reply to this email!</p>
            </div>
          `
        });

        if (resendError) {
          console.error("Resend API failed to send onboarding email (Google):", resendError);
        }
      }
    }

    // Create session
    const session = await createSession(user.id);

    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    console.error('Google OAuth callback error:', error instanceof Error ? error.message : error);
    const appUrl = getOAuthAppUrl(request);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`);
  }
}
