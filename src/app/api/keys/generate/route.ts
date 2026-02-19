import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function generateApiKey() {
  return 'callio_' + randomBytes(32).toString('hex');
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const key = generateApiKey();
    
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: key,
        keyLast4: key.slice(-4),
        name: 'callio',
      },
    });

    // Redirect back to keys page
    return NextResponse.redirect(new URL('/keys', request.url));
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.redirect(new URL('/keys?error=failed-to-generate', request.url));
  }
}
