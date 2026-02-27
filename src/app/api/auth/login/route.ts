import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log("Creating session for user", user.id);
    const session = await createSession(user.id);
    console.log("Session created", session.token.substring(0, 10));

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
