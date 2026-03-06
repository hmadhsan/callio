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
