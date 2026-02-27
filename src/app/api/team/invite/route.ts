import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
        let fromEmail = process.env.RESEND_FROM_INVITES || 'invites@callio.dev';
        // Strip out accidental quotes if set in Vercel like RESEND_FROM_INVITES="invites@callio.dev"
        fromEmail = fromEmail.replace(/["']/g, '').trim();
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

            if (resend) {
                console.log(`Sending immediate invite email from ${fromEmail} to ${email}`);
                const { error: resendError } = await resend.emails.send({
                    from: `Callio <${fromEmail}>`,
                    to: email,
                    subject: `You've been added to ${workspace.name} on Callio`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>You're in!</h2>
                            <p><strong>${user.name || user.email}</strong> has added you to the <strong>${workspace.name}</strong> workspace on Callio.</p>
                            <p>You can now access this workspace from your dashboard.</p>
                            <div style="margin: 30px 0;">
                                <a href="${appUrl}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
                            </div>
                        </div>
                    `
                });

                if (resendError) {
                    console.error("Resend API failed to send to existing user:", resendError);
                } else {
                    console.log("Resend API response successful for existing user");
                }
            } else {
                console.warn("RESEND_API_KEY is not defined. Skipping email sending.");
            }

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

        const inviteLink = `${appUrl}/register?invite=${token}`;

        if (resend) {
            console.log(`Sending new user invite email from ${fromEmail} to ${email}`);
            const { error: resendError } = await resend.emails.send({
                from: `Callio <${fromEmail}>`,
                to: email,
                subject: `You've been invited to join ${workspace.name} on Callio`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>You've been invited!</h2>
                        <p><strong>${user.name || user.email}</strong> has invited you to join the <strong>${workspace.name}</strong> workspace on Callio.</p>
                        <p>Click the button below to accept the invitation and set up your account.</p>
                        <div style="margin: 30px 0;">
                            <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${inviteLink}</p>
                    </div>
                `
            });

            if (resendError) {
                console.error("Resend API failed to send to new user:", resendError);
                // We don't necessarily want to fail the invite if the email fails, but we want it logged.
            } else {
                console.log("Resend API response successful for new user");
            }
        } else {
            console.warn("RESEND_API_KEY is not defined. Skipping email sending.");
        }
        return NextResponse.json({ success: true, message: 'Invite created' });

    } catch (err: any) {
        console.error('Invite error:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
