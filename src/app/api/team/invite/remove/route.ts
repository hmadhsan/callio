import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { user, workspace } = await getCurrentUserWithWorkspace();

        if (!user || !workspace) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { inviteId, workspaceId } = await request.json();

        if (!inviteId || !workspaceId) {
            return NextResponse.json({ error: 'Invite ID and workspace ID are required' }, { status: 400 });
        }

        if (workspace.id !== workspaceId) {
            return NextResponse.json({ error: 'You do not have permission to modify this workspace' }, { status: 403 });
        }

        // Verify current user is OWNER or ADMIN
        const membership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: workspace.id,
                    userId: user.id
                }
            }
        });

        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return NextResponse.json({ error: 'Only Owners or Admins can remove invites' }, { status: 403 });
        }

        const invite = await prisma.workspaceInvite.findUnique({
            where: { id: inviteId }
        });

        if (!invite || invite.workspaceId !== workspace.id) {
            return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
        }

        await prisma.workspaceInvite.delete({
            where: { id: inviteId }
        });

        return NextResponse.json({ success: true, message: 'Invite removed' });
    } catch (err: any) {
        console.error('Remove invite error:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
