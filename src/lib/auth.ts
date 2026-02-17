import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import prisma from './prisma';

const SESSION_COOKIE = 'callio_session';
const SESSION_DAYS = 7;
const MAGIC_LINK_MINUTES = 15;

function createToken() {
  return randomBytes(32).toString('hex');
}

export async function createMagicLink(email: string) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function consumeMagicLink(token: string) {
  const record = await prisma.magicLinkToken.findUnique({
    where: { token },
  });

  if (!record) {
    return null;
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.magicLinkToken.delete({ where: { token } }).catch(() => null);
    return null;
  }

  await prisma.magicLinkToken.delete({ where: { token } }).catch(() => null);
  return record.email;
}

export async function createSession(userId: string) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getUserFromSessionToken(token?: string) {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } }).catch(() => null);
    return null;
  }

  return session.user;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getUserFromSessionToken(token);
}

export async function clearSession(token?: string) {
  if (!token) {
    return;
  }

  await prisma.session.delete({ where: { token } }).catch(() => null);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export { SESSION_COOKIE };
