import { NextRequest, NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/auth';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { token } = await createMagicLink(email);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const loginUrl = `${appUrl}/auth/callback?token=${token}`;

    const isProd = process.env.NODE_ENV === 'production';
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      if (isProd) {
        return NextResponse.json(
          { error: 'Email service not configured.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        loginUrl,
        warning: 'Email service not configured. Use the login URL directly.',
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Your Callio sign-in link',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Sign in to Callio</h2>
          <p>Click the link below to sign in. This link expires in 15 minutes.</p>
          <p><a href="${loginUrl}">Sign in to Callio</a></p>
          <p>If you did not request this email, you can ignore it.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Magic link error:', error);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json(
      {
        error: 'Unable to send magic link',
        details: isProd ? undefined : (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
