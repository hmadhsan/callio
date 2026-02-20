import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes, createHash } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function generateApiKey() {
  return 'callio_' + randomBytes(32).toString('hex');
}

function hashApiKey(key: string) {
  return createHash('sha256').update(key).digest('hex');
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = body.name?.trim() || 'Default API Key';
    
    const plainKey = generateApiKey();
    const keyHash = hashApiKey(plainKey);
    
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        keyHash: keyHash,
        keyLast4: plainKey.slice(-4),
        name: name,
      },
    });

    // Return the plain key (only time it will be visible)
    return NextResponse.json({ 
      success: true, 
      key: plainKey,
      keyLast4: plainKey.slice(-4),
      name: name,
      id: apiKey.id,
      createdAt: apiKey.createdAt
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 });
  }
}
