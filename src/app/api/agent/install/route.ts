import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE, isAdmin } from '@/lib/auth';
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

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'API slug is required' }, { status: 400 });
    }

    const api = await prisma.api.findUnique({ where: { slug } });
    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    // ── Plan key-limit check ──────────────────────────────────
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    let plan = (subscription?.plan || 'free') as keyof typeof PLANS;
    if (isAdmin(user.email)) {
      plan = 'admin';
    }
    const maxKeys = PLANS[plan]?.maxKeys ?? PLANS.free.maxKeys;

    if (maxKeys !== Infinity) {
      const existingKeyCount = await prisma.apiKey.count({
        where: { workspaceId: workspace.id },
      });
      if (existingKeyCount >= maxKeys) {
        const errorMsg = maxKeys === 0
          ? 'Subscribe to a plan to start connecting agents.'
          : `Your ${PLANS[plan]?.name || 'Free'} plan allows a maximum of ${maxKeys} agent connection${maxKeys === 1 ? '' : 's'}. Please upgrade to connect more.`;
        return NextResponse.json({
          error: errorMsg,
          upgrade: true,
        }, { status: 403 });
      }
    }

    // Generate a per-API key
    const { raw, keyHash, keyLast4 } = generateApiKey('production');

    await prisma.apiKey.create({
      data: {
        name: `${api.name} Agent Key`,
        keyHash,
        keyLast4,
        userId: user.id,
        workspaceId: workspace.id,
        apiId: api.id,
        environment: 'production',
      },
    });

    return NextResponse.json({
      success: true,
      key: raw,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Agent install error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

