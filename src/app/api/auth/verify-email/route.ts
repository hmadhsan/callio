import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { getCatalogApiCount } from '@/lib/catalog-count';

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
            const apiCount = await getCatalogApiCount();
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
                            <p>Your email is verified and your account is ready. Callio is the API gateway for AI agents — one key, one proxy, and ${apiCount} APIs in the catalog for whatever your agent needs to do.</p>
                            <p><strong>Three steps to your first agent call:</strong></p>
                            <ol>
                                <li><strong>Generate a key</strong> — start with a sandbox key so tests don't count toward your plan quota.</li>
                                <li><strong>Pick your path</strong> — install the MCP server into Cursor, Claude, or Antigravity (<a href="${appUrl}/mcp" style="color: #555;">setup guide</a>), or call the HTTP proxy directly from any backend or agent runtime.</li>
                                <li><strong>Ship</strong> — swap to a production key when you're ready for real traffic, and watch usage in the dashboard.</li>
                            </ol>
                            <div style="margin: 30px 0; display: flex; gap: 12px; flex-wrap: wrap;">
                                <a href="${appUrl}/dashboard?onboarding=1"
                                    style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                    Go to Dashboard
                                </a>
                                <a href="${appUrl}/mcp"
                                    style="background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; border: 1px solid #ccc; display: inline-block;">
                                    Install MCP Server
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
        const response = NextResponse.redirect(`${appUrl}/dashboard?onboarding=1`);
        response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

        return response;
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.redirect(`${appUrl}/login?error=invalid-token`);
    }
}
