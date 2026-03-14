const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting payment-related APIs...');

  const paymentApis = await prisma.api.findMany({
    where: {
      OR: [
        { category: 'Payments' },
        { slug: 'stripe' },
        { name: { contains: 'Stripe', mode: 'insensitive' } },
        { name: { contains: 'PayPal', mode: 'insensitive' } },
        { name: { contains: 'Lemon Squeezy', mode: 'insensitive' } },
        { name: { contains: 'Paddle', mode: 'insensitive' } },
      ]
    }
  });

  console.log(`Found ${paymentApis.length} payment-related APIs to delete.`);

  for (const api of paymentApis) {
    console.log(`Deleting ${api.name} (${api.slug})...`);
    // Cascade delete handles endpoints, credentials, favorites, and apiKeys
    await prisma.api.delete({ where: { id: api.id } });
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
