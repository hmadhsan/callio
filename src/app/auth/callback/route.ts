import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { consumeMagicLink, createSession, getSessionCookieOptions, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing-token', request.url));
  }

  const email = await consumeMagicLink(token);

  if (!email) {
    return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const session = await createSession(user.id);

  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions());
  return response;
}
