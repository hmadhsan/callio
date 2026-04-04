import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { generateMarketingPosts, normalizePlatforms } from '@/lib/marketing/templates';
import { getDefaultScheduleStart } from '@/lib/marketing/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user.email)) {
    return unauthorized();
  }

  const posts = await prisma.marketingPost.findMany({
    orderBy: [{ scheduledFor: 'asc' }, { createdAt: 'asc' }],
    take: 100,
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user.email)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({}));
  const days = Math.max(1, Math.min(60, Number(body.days) || 30));
  const platforms = normalizePlatforms(body.platforms);
  const overwrite = Boolean(body.overwrite);
  const startDate = body.startDate ? new Date(body.startDate) : getDefaultScheduleStart();

  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ error: 'Invalid startDate.' }, { status: 400 });
  }

  const generated = generateMarketingPosts({
    startDate,
    days,
    platforms,
  });

  if (overwrite) {
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + days);

    await prisma.marketingPost.deleteMany({
      where: {
        platform: {
          in: platforms,
        },
        scheduledFor: {
          gte: startDate,
          lt: endDate,
        },
        status: {
          in: ['DRAFT', 'SCHEDULED', 'FAILED'],
        },
      },
    });
  }

  const created = [];

  for (const post of generated) {
    const existing = await prisma.marketingPost.findFirst({
      where: {
        platform: post.platform,
        scheduledFor: post.scheduledFor,
      },
    });

    if (existing) {
      continue;
    }

    created.push(
      await prisma.marketingPost.create({
        data: {
          platform: post.platform,
          topic: post.topic,
          content: post.content,
          scheduledFor: post.scheduledFor,
          status: 'SCHEDULED',
        },
      })
    );
  }

  return NextResponse.json({
    createdCount: created.length,
    posts: created,
  });
}
