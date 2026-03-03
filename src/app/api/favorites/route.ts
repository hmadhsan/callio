import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { apiId } = body;

        if (!apiId) {
            return NextResponse.json({ error: 'apiId is required' }, { status: 400 });
        }

        // Check if the API exists
        const api = await prisma.api.findUnique({
            where: { id: apiId },
        });

        if (!api) {
            return NextResponse.json({ error: 'API not found' }, { status: 404 });
        }

        // Check if already favorited
        const existingFavorite = await prisma.favoriteApi.findUnique({
            where: {
                userId_apiId: {
                    userId: user.id,
                    apiId: apiId,
                },
            },
        });

        if (existingFavorite) {
            // Unfavorite
            await prisma.favoriteApi.delete({
                where: { id: existingFavorite.id },
            });
            return NextResponse.json({ favorited: false });
        } else {
            // Favorite
            await prisma.favoriteApi.create({
                data: {
                    userId: user.id,
                    apiId: apiId,
                },
            });
            return NextResponse.json({ favorited: true });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
