import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    include: {
      api: {
        select: {
          name: true,
          slug: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ 
    keys: keys.map(k => ({
      id: k.id,
      keyLast4: k.keyLast4,
      apiName: k.api.name,
      apiSlug: k.api.slug,
      createdAt: k.createdAt,
    }))
  });
}
