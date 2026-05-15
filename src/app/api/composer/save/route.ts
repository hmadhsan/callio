import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserWithWorkspace } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, workspaceId, name, description } = body;

    let targetWorkspaceId = workspaceId;
    if (!targetWorkspaceId) {
      const { user, workspace } = await getCurrentUserWithWorkspace();
      if (!user || !workspace) {
        return NextResponse.json({ error: 'Missing workflow and no active workspace in session' }, { status: 401 });
      }
      targetWorkspaceId = workspace.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (prisma as any).workflow.create({
      data: {
        workspaceId: targetWorkspaceId,
        name: name ?? (workflow.name ?? 'Untitled workflow'),
        description: description ?? workflow.description ?? null,
        data: workflow,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    console.error('Composer save error:', error);
    return NextResponse.json({ error: 'Failed to save workflow' }, { status: 500 });
  }
}
