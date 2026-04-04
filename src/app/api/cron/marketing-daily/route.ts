import { NextRequest, NextResponse } from 'next/server';
import { publishDuePosts } from '@/lib/marketing/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest) {
  const secret = process.env.MARKETING_CRON_SECRET || process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const header = request.headers.get('authorization');
  return header === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await publishDuePosts();

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
