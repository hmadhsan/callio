import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = await getUserFromSessionToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No active workspace found' }, { status: 400 });
    }

    const { id } = await params;

    const apiKey = await prisma.apiKey.findUnique({ where: { id } });

    if (!apiKey || apiKey.workspaceId !== workspace.id) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Key deletion error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
