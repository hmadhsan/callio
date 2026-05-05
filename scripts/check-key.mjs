import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';

const key = 'callio_test_817ef6a9cf859ad576791194cf444cc388f1e6b7c11887aa';
const hash = createHash('sha256').update(key).digest('hex');
console.log('Looking up hash:', hash);

const prisma = new PrismaClient();
const record = await prisma.apiKey.findUnique({
  where: { keyHash: hash },
  include: { user: true },
});

if (record) {
  console.log('Found key:', {
    id: record.id,
    name: record.name,
    environment: record.environment,
    workspaceId: record.workspaceId,
    deletedAt: record.deletedAt,
    userEmail: record.user?.email,
  });
} else {
  console.log('Key NOT found in DB');
}

await prisma.$disconnect();
