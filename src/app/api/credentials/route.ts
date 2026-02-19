import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const credentials = await prisma.apiCredential.findMany({
    where: { userId: user.id },
    include: {
      api: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({
    credentials: credentials.map((credential) => ({
      id: credential.id,
      apiId: credential.apiId,
      apiName: credential.api.name,
      apiSlug: credential.api.slug,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { apiSlug, providerKey } = body;

    if (!apiSlug || !providerKey) {
      return NextResponse.json({ error: 'apiSlug and providerKey are required' }, { status: 400 });
    }

    const api = await prisma.api.findUnique({ where: { slug: apiSlug } });
    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    const credential = await prisma.apiCredential.upsert({
      where: { userId_apiId: { userId: user.id, apiId: api.id } },
      update: { providerKey },
      create: { userId: user.id, apiId: api.id, providerKey },
    });

    return NextResponse.json({
      success: true,
      credentialId: credential.id,
      apiId: api.id,
      apiSlug: api.slug,
    });
  } catch (error) {
    console.error('Credential error:', error);
    return NextResponse.json({ error: 'Unable to save provider key' }, { status: 500 });
  }
}
