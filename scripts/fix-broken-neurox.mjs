import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.api.delete({ where: { slug: 'neurox-image-gen-api' } });
const noKey = await prisma.api.findMany({ where: { allowUnauthenticated: true }, include: { _count: { select: { endpoints: true } } } });
const missing = noKey.filter(a => a._count.endpoints === 0).map(a => a.slug);
console.log('deleted neurox-image-gen-api');
console.log('No-key APIs:', noKey.length, '| missing endpoints:', missing.length);
await prisma.$disconnect();
