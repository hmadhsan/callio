import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { consumePasswordResetToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        // Validate token and get email (this also deletes the token to prevent reuse)
        const email = await consumePasswordResetToken(token);

        if (!email) {
            return NextResponse.json({ error: 'Invalid or expired password reset link' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            success: true,
            message: 'Password successfully reset.',
        });

    } catch (error: unknown) {
        console.error('Reset password error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
