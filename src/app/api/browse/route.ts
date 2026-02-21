import { NextResponse } from 'next/server';
import { getAllApis } from '@/lib/apiService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apis = await getAllApis();
    return NextResponse.json(apis);
  } catch (error) {
    console.error('Browse API error:', error);
    return NextResponse.json({ error: 'Failed to fetch APIs' }, { status: 500 });
  }
}
