import { NextRequest, NextResponse } from 'next/server';
import { clearSession, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    await clearSession(token);

    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE);

    return response;
  } catch (error: unknown) {
    console.error('Logout error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
