import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/auth';

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

        // Verify user exists, but don't leak this info in the error response (security best practice)
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const { token } = await createPasswordResetToken(email);

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';
            const resetUrl = `${appUrl}/reset-password?token=${token}`;

            // In production, send via Resend
            if (process.env.RESEND_API_KEY) {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                await resend.emails.send({
                    from: 'Callio <noreply@callio.dev>',
                    to: email,
                    subject: 'Reset your Callio password',
                    html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="color: #111;">Reset your password</h2>
              <p style="color: #555;">Click the link below to reset your password. This link expires in 15 minutes.</p>
              <a href="${resetUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Reset Password</a>
              <p style="color: #999; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
          `,
                });
            } else {
                // Fallback or dev
                console.log(`Password reset link for ${email}: ${resetUrl}`);
            }
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({
            success: true,
            message: 'If an account exists with that email, we sent a password reset link.',
        });
    } catch (error: unknown) {
        console.error('Forgot password error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
