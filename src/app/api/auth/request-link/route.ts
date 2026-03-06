import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: true }); // silent no-op

    const user = await prisma.user.findUnique({ where: { email } });

    // Only resend if user exists and is still unverified
    if (!user || user.emailVerified) {
      // Return success silently to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: token },
    });

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const fromEmail = (process.env.RESEND_FROM_ONBOARDING || 'onboarding@callio.dev').replace(/[\"']/g, '').trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';

    if (resend) {
      await resend.emails.send({
        from: `Callio <${fromEmail}>`,
        to: email,
        subject: 'Please verify your email — Callio',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #000;">Verify your email</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Click the button below to verify your email address and activate your Callio account.</p>
            <div style="margin: 30px 0;">
              <a href="${appUrl}/api/auth/verify-email?token=${token}"
                style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify my email
              </a>
            </div>
            <p style="color: #888; font-size: 14px;">This link expires in 24 hours. If you didn't sign up for Callio, you can safely ignore this email.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request link error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
