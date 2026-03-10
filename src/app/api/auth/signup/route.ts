import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

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

    // Generate email verification token
    // Invite-based signups skip verification (the invite proves email ownership)
    const isInviteBased = !!workspaceInvite;
    const emailVerificationToken = isInviteBased ? null : randomBytes(32).toString('hex');

    let user;

    if (workspaceInvite) {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          emailVerified: true, // invite-based = email already verified
          memberships: {
            create: {
              role: workspaceInvite.role,
              workspace: { connect: { id: workspaceInvite.workspaceId } }
            }
          }
        },
      });

      await prisma.workspaceInvite.delete({ where: { id: workspaceInvite.id } });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          emailVerified: false,
          emailVerificationToken,
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

    // Send verification or welcome email
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const fromEmail = (process.env.RESEND_FROM_ONBOARDING || 'onboarding@callio.dev').replace(/[\"']/g, '').trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';

    if (resend) {
      if (!isInviteBased && emailVerificationToken) {
        // Send verification email
        const verifyUrl = `${appUrl}/api/auth/verify-email?token=${emailVerificationToken}`;
        await resend.emails.send({
          from: `Callio <${fromEmail}>`,
          to: email,
          subject: 'Please verify your email — Callio',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #000;">Verify your email</h2>
              <p>Hi ${user.name || 'there'},</p>
              <p>Thanks for signing up to Callio! Click the button below to verify your email address and activate your account.</p>
              <div style="margin: 30px 0;">
                <a href="${verifyUrl}"
                  style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Verify my email
                </a>
              </div>
              <p style="color: #888; font-size: 14px;">If you didn't sign up for Callio, you can safely ignore this email.</p>
            </div>
          `,
        });
      } else {
        // Welcome email for invite-based signups
        await resend.emails.send({
          from: `Callio <${fromEmail}>`,
          to: email,
          subject: 'Welcome to Callio! 🚀',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #000;">Welcome to Callio!</h2>
              <p>Hi ${user.name || 'there'},</p>
              <p>Your account has been created and you're ready to go!</p>
              <div style="margin: 30px 0;">
                <a href="${appUrl}/dashboard"
                  style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Go to your Dashboard
                </a>
              </div>
            </div>
          `,
        });
      }
    }

    if (!isInviteBased) {
      // Don't auto-login — user must verify email first
      return NextResponse.json({ success: true, requiresVerification: true, email }, { status: 201 });
    }

    // Invite-based: log user in immediately
    const { createSession, getSessionCookieOptions, SESSION_COOKIE } = await import('@/lib/auth');
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
