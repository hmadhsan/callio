import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { generateApiKey } from '@/lib/keys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = await getUserFromSessionToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const keyName = name || 'Default API Key';

    const { raw, keyHash, keyLast4 } = generateApiKey();

    await prisma.apiKey.create({
      data: {
        name: keyName,
        keyHash,
        keyLast4,
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
