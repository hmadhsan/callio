import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get(SESSION_COOKIE)?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await getUserFromSessionToken(token);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { firstName, lastName, name } = await request.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                firstName: firstName || null,
                lastName: lastName || null,
                name: name.trim(),
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
