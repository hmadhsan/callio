import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { encryptProviderKey } from '@/lib/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = await getUserFromSessionToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiSlug, providerKey } = await request.json();

    if (!apiSlug || !providerKey) {
      return NextResponse.json({ error: 'API slug and provider key are required' }, { status: 400 });
    }

    const api = await prisma.api.findUnique({ where: { slug: apiSlug } });
    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    // Encrypt the provider key before storing
    const encryptedKey = encryptProviderKey(providerKey);

    await prisma.apiCredential.upsert({
      where: {
        userId_apiId: {
          userId: user.id,
          apiId: api.id,
        },
      },
      update: {
        providerKey: encryptedKey,
      },
      create: {
        userId: user.id,
        apiId: api.id,
        providerKey: encryptedKey,
      },
    });

    return NextResponse.json({ success: true, message: 'Provider key saved' });
  } catch (error: unknown) {
    console.error('Credential save error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
