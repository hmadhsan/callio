import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, workspaceId, name, description } = body;

    if (!workflow || !workspaceId) {
      return NextResponse.json({ error: 'Missing workflow or workspaceId' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (prisma as any).workflow.create({
      data: {
        workspaceId,
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
