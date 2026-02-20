import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function generateApiKey() {
  return 'callio_' + randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = body.name?.trim() || 'callio';
    
    const key = generateApiKey();
    
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: key,
        keyLast4: key.slice(-4),
        name: name,
      },
    });

    return NextResponse.json({ success: true, key: apiKey }, { status: 200 });
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 });
  }
}
