import prisma from '@/lib/prisma';
import { publishToPlatform } from './platforms';

function startOfPostingWindow(date: Date) {
  const result = new Date(date);
  result.setUTCHours(8, 0, 0, 0);
  return result;
}

export function getDefaultScheduleStart() {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 1);
  return startOfPostingWindow(start);
}

export async function publishQueuedPost(postId: string) {
  const post = await prisma.marketingPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Marketing post not found.');
  }

  if (post.status === 'PUBLISHED') {
    return post;
  }

  const published = await publishToPlatform(post.platform, post.content);

  return prisma.marketingPost.update({
    where: { id: post.id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      externalId: published.externalId,
      externalUrl: published.externalUrl,
      error: null,
    },
  });
}

export async function markPostFailed(postId: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown publishing error';

  return prisma.marketingPost.update({
    where: { id: postId },
    data: {
      status: 'FAILED',
      error: message,
    },
  });
}

export async function publishDuePosts() {
  const duePosts = await prisma.marketingPost.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledFor: {
        lte: new Date(),
      },
    },
    orderBy: {
      scheduledFor: 'asc',
    },
  });

  const results = [];

  for (const post of duePosts) {
    try {
      const published = await publishQueuedPost(post.id);
      results.push({
        id: post.id,
        platform: post.platform,
        status: 'PUBLISHED',
        externalUrl: published.externalUrl,
      });
    } catch (error) {
      await markPostFailed(post.id, error);
      results.push({
        id: post.id,
        platform: post.platform,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown publishing error',
      });
    }
  }

  return results;
}
