import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user, workspace } = await getCurrentUserWithWorkspace();
    if (!user) return NextResponse.json({ user: null, workspace: null }, { status: 401 });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, workspace: workspace ? { id: workspace.id, name: workspace.name, slug: workspace.slug } : null });
  } catch (error) {
    console.error('Auth context error:', error);
    return NextResponse.json({ user: null, workspace: null }, { status: 500 });
  }
}
