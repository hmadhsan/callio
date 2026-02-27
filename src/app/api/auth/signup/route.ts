import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, inviteToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    let workspaceInvite = null;
    if (inviteToken) {
      workspaceInvite = await prisma.workspaceInvite.findUnique({
        where: { token: inviteToken }
      });

      if (workspaceInvite && workspaceInvite.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invite link has expired' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;

    if (workspaceInvite) {
      // User is joining an existing workspace via invite
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          memberships: {
            create: {
              role: workspaceInvite.role,
              workspace: {
                connect: { id: workspaceInvite.workspaceId }
              }
            }
          }
        },
      });

      // Delete the used invite
      await prisma.workspaceInvite.delete({
        where: { id: workspaceInvite.id }
      });
    } else {
      // Normal signup, create a personal workspace
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          memberships: {
            create: {
              role: 'OWNER',
              workspace: {
                create: {
                  name: 'Personal Workspace',
                  slug: `personal-${randomBytes(4).toString('hex')}`,
                }
              }
            }
          }
        },
      });
    }

    const session = await createSession(user.id);

    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );

    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    console.error('Signup error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
