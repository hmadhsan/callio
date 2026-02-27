import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { generateApiKey } from '@/lib/keys';
import { PLANS } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = await getUserFromSessionToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check plan key limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    const plan = (subscription?.plan || 'free') as keyof typeof PLANS;
    const maxKeys = PLANS[plan]?.maxKeys ?? PLANS.free.maxKeys;

    if (maxKeys !== Infinity) {
      const existingKeyCount = await prisma.apiKey.count({
        where: { userId: user.id },
      });
      if (existingKeyCount >= maxKeys) {
        return NextResponse.json({
          error: `Your ${PLANS[plan]?.name || 'Free'} plan allows ${maxKeys} agent connection${maxKeys === 1 ? '' : 's'}. Upgrade to connect more.`,
          upgrade: 'https://callio.dev/pricing',
        }, { status: 403 });
      }
    }

    const { name, scopes } = await request.json();
    const keyName = name || 'Default API Key';
    const keyScopes = Array.isArray(scopes) ? scopes : [];

    const { raw, keyHash, keyLast4 } = generateApiKey();

    await prisma.apiKey.create({
      data: {
        name: keyName,
        keyHash,
        keyLast4,
        scopes: keyScopes,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      key: raw,
      message: 'Save this key — it won\'t be shown again.',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Key generation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
