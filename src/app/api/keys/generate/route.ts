import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE, isAdmin } from '@/lib/auth';
import type { ApiKeyEnvironment } from '@prisma/client';
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

    const workspace = await getActiveWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No active workspace found' }, { status: 400 });
    }

    // Check plan key limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    let plan = (subscription?.plan || 'free') as keyof typeof PLANS;
    if (isAdmin(user.email)) {
      plan = 'admin';
    }
    const maxKeys = PLANS[plan]?.maxKeys ?? PLANS.free.maxKeys;

    if (maxKeys !== Infinity) {
      // Count ALL keys ever created for this workspace (including soft-deleted)
      // This prevents the bypass of generating a key, deleting it, and generating again
      const totalKeyCount = await prisma.apiKey.count({
        where: { workspaceId: workspace.id },
      });
      if (totalKeyCount >= maxKeys) {
        const errorMsg = maxKeys === 0
          ? 'Subscribe to a plan to start generating API keys and connecting agents.'
          : `Your ${PLANS[plan]?.name || 'Free'} plan allows ${maxKeys} agent connection${maxKeys === 1 ? '' : 's'}. Upgrade to connect more.`;
        return NextResponse.json({
          error: errorMsg,
          upgrade: 'https://callio.dev/pricing',
        }, { status: 403 });
      }
    }

    const body = await request.json();
    const { name, scopes, monthlyLimit } = body;
    const keyName = name || 'Default API Key';
    const keyScopes = Array.isArray(scopes) ? scopes : [];
    const environment: ApiKeyEnvironment =
      body?.environment === 'sandbox' ? 'sandbox' : 'production';

    const { raw, keyHash, keyLast4 } = generateApiKey(environment);

    await prisma.apiKey.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        name: keyName,
        keyHash,
        keyLast4,
        scopes: keyScopes,
        monthlyLimit: typeof monthlyLimit === 'number' ? monthlyLimit : null,
        environment,
      },
    });

    return NextResponse.json({
      success: true,
      key: raw,
      environment,
      message: 'Save this key — it won\'t be shown again.',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Key generation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
