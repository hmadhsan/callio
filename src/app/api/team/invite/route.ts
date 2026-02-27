import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { user, workspace } = await getCurrentUserWithWorkspace();

        if (!user || !workspace) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { email, workspaceId } = await request.json();

        if (!email || !workspaceId) {
            return NextResponse.json({ error: 'Email and workspace ID are required' }, { status: 400 });
        }

        if (workspace.id !== workspaceId) {
            return NextResponse.json({ error: 'You do not have permission to invite to this workspace' }, { status: 403 });
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
            return NextResponse.json({ error: 'Only Owners or Admins can invite new members' }, { status: 403 });
        }

        // Check if the user is already in the workspace
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { memberships: true }
        });

        if (existingUser) {
            const alreadyMember = existingUser.memberships.find(m => m.workspaceId === workspace.id);
            if (alreadyMember) {
                return NextResponse.json({ error: 'User is already a member of this workspace' }, { status: 400 });
            }

            // Automatically add them if they already have an account
            await prisma.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: existingUser.id,
                    role: 'MEMBER'
                }
            });

            return NextResponse.json({ success: true, message: 'User added to workspace immediately.' });
        }

        // Otherwise, create an invite token for when they sign up
        const existingInvite = await prisma.workspaceInvite.findUnique({
            where: {
                workspaceId_email: {
                    workspaceId: workspace.id,
                    email
                }
            }
        });

        if (existingInvite) {
            return NextResponse.json({ error: 'An invite has already been sent to this email' }, { status: 400 });
        }

        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

        await prisma.workspaceInvite.create({
            data: {
                workspaceId: workspace.id,
                email,
                token,
                expiresAt
            }
        });

        // In a real app, send an email with the link here.
        return NextResponse.json({ success: true, message: 'Invite created' });

    } catch (err: any) {
        console.error('Invite error:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
