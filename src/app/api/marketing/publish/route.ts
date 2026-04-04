import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { markPostFailed, publishQueuedPost } from '@/lib/marketing/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user.email)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({}));
  const requestedId = typeof body.id === 'string' ? body.id : null;

  const post =
    requestedId
      ? await prisma.marketingPost.findUnique({ where: { id: requestedId } })
      : await prisma.marketingPost.findFirst({
        where: {
          status: {
            in: ['SCHEDULED', 'FAILED'],
          },
        },
        orderBy: {
          scheduledFor: 'asc',
        },
      });

  if (!post) {
    return NextResponse.json({ error: 'No marketing post available to publish.' }, { status: 404 });
  }

  try {
    const published = await publishQueuedPost(post.id);
    return NextResponse.json({ post: published });
  } catch (error) {
    await markPostFailed(post.id, error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Publishing failed.',
      },
      { status: 500 }
    );
  }
}
