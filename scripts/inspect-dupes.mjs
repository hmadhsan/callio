import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PAIRS = [
  ['anthropic', 'anthropic-claude'],
  ['cohere', 'cohere-ai'],
  ['groq', 'groq-llm'],
  ['notion', 'notion-api'],
  ['resend', 'resend-email'],
  ['stability', 'stability-ai'],
  ['linear', 'linear-issues'],
  ['twilio', 'twilio-sms'],
  ['perplexity', 'perplexity-ai'],
];

for (const pair of PAIRS) {
  console.log('\n──', pair.join(' vs '));
  for (const slug of pair) {
    const a = await prisma.api.findUnique({
      where: { slug },
      include: { _count: { select: { endpoints: true, apiKeys: true, credentials: true, favoritedBy: true } } },
    });
    if (!a) { console.log(`  ${slug}: NOT FOUND`); continue; }
    console.log(`  ${slug.padEnd(22)} cat=${a.category.padEnd(20)} ep=${a._count.endpoints} keys=${a._count.apiKeys} creds=${a._count.credentials} favs=${a._count.favoritedBy} baseUrl=${a.baseUrl ?? '—'}`);
  }
}

await prisma.$disconnect();
