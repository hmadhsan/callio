const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const result = await p.apiCredential.delete({ where: { id: 'cmlve17od0003ku5br7laeeri' } });
  console.log('Deleted wrong credential:', result.id);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
