const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const apis = await p.api.findMany({
    include: { endpoints: true },
    orderBy: { name: 'asc' }
  });
  
  console.log('=== Current API Endpoint Counts ===');
  let total = 0;
  apis.forEach(a => {
    console.log(`${a.slug}: ${a.endpoints.length} endpoints`);
    total += a.endpoints.length;
  });
  console.log(`\nTotal: ${apis.length} APIs, ${total} endpoints`);
  
  // Also show endpoint details for a sample
  const sample = apis.find(a => a.endpoints.length > 0);
  if (sample) {
    console.log(`\nSample endpoint structure (${sample.slug}):`);
    console.log(JSON.stringify(sample.endpoints[0], null, 2));
  }
  
  await p.$disconnect();
}

main();
