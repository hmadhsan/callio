import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import { encryptProviderKey } from '@/lib/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { user, workspace } = await getCurrentUserWithWorkspace();

    if (!user || !workspace) {
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
        workspaceId_apiId: {
          workspaceId: workspace.id,
          apiId: api.id,
        },
      },
      update: {
        providerKey: encryptedKey,
        userId: user.id, // Keep track of who last updated it
      },
      create: {
        userId: user.id,
        workspaceId: workspace.id,
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
