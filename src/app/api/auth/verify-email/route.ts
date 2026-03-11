import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';

    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(`${appUrl}/login?error=invalid-token`);
        }

        const user = await prisma.user.findUnique({
            where: { emailVerificationToken: token },
        });

        if (!user) {
            return NextResponse.redirect(`${appUrl}/login?error=invalid-token`);
        }

        // Mark email verified and clear token
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true, emailVerificationToken: null },
        });

        // Send Welcome email
        try {
            const { Resend } = await import('resend');
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey) {
                const resend = new Resend(resendKey);
                const fromEmail = (process.env.RESEND_FROM_ONBOARDING || 'onboarding@callio.dev').replace(/["']/g, '').trim();
                await resend.emails.send({
                    from: `Callio <${fromEmail}>`,
                    to: user.email,
                    subject: 'Welcome to Callio! 🚀',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #000;">Welcome to Callio!</h2>
                            <p>Hi ${user.name || 'there'},</p>
                            <p>Your email has been verified and your account is ready to go! You now have access to 50+ APIs through a single gateway.</p>
                            <p><strong>Here's how to get started:</strong></p>
                            <ol>
                                <li>Browse available APIs in the marketplace</li>
                                <li>Generate your Callio API key</li>
                                <li>Start calling APIs from your agent or code</li>
                            </ol>
                            <div style="margin: 30px 0;">
                                <a href="${appUrl}/dashboard"
                                    style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Go to your Dashboard
                                </a>
                            </div>
                            <p style="color: #888; font-size: 14px;">Need help? Visit our <a href="${appUrl}/docs" style="color: #555;">docs</a> or <a href="${appUrl}/contact" style="color: #555;">contact us</a>.</p>
                        </div>
                    `,
                });
            }
        } catch (emailErr) {
            console.error('Welcome email error:', emailErr);
            // Don't block login on email failure
        }

        // Log the user in
        const session = await createSession(user.id);
        const response = NextResponse.redirect(`${appUrl}/dashboard?verified=1`);
        response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

        return response;
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.redirect(`${appUrl}/login?error=invalid-token`);
    }
}
