import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ error: 'Missing ref' }, { status: 400 });
  }

  try {
    // Fire and forget - increment click count for this affiliate
    await prisma.affiliate.update({
      where: { referralCode: ref },
      data: { clickCount: { increment: 1 } },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Catch cases where affiliate ref doesn't exist
    return NextResponse.json({ error: 'Affiliate not found or error' }, { status: 404 });
  }
}
