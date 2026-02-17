import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { generateApiKey } from '@/lib/keys';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name } = body;

    if (!slug) {
      return NextResponse.json({ error: 'API slug is required' }, { status: 400 });
    }

    const api = await prisma.api.findUnique({ where: { slug } });

    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    const { raw, keyHash, keyLast4 } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        apiId: api.id,
        userId: user.id,
        name: name || 'Default Agent Key',
        keyHash,
        keyLast4,
      },
    });

    return NextResponse.json({
      apiKeyId: apiKey.id,
      apiName: api.name,
      apiSlug: api.slug,
      key: raw,
      keyLast4,
    });
  } catch (error) {
    console.error('Agent install error:', error);
    return NextResponse.json({ error: 'Unable to install API' }, { status: 500 });
  }
}
