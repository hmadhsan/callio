const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.session.deleteMany({});
  console.log(`Cleared ${result.count} sessions from database`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
