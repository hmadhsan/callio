import { NextRequest, NextResponse } from 'next/server';
import { getApiBySlug } from '@/lib/apiService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const api = await getApiBySlug(slug);

    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    return NextResponse.json(api);
  } catch (error) {
    console.error('Browse API detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch API' }, { status: 500 });
  }
}
