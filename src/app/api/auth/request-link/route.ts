import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createMagicLink, createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { token } = await createMagicLink(email);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicUrl = `${appUrl}/auth/callback?token=${token}`;

    // In production, send via Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Callio <noreply@callio.dev>',
        to: email,
        subject: 'Sign in to Callio',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #111;">Sign in to Callio</h2>
            <p style="color: #555;">Click the link below to sign in. This link expires in 15 minutes.</p>
            <a href="${magicUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Sign In</a>
            <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } else {
      console.log(`Magic link for ${email}: ${magicUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email for a sign-in link',
      // Include token in dev for testing
      ...(process.env.NODE_ENV !== 'production' ? { token, magicUrl } : {}),
    });
  } catch (error: unknown) {
    console.error('Magic link error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
