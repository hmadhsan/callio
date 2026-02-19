const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashApiKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

async function main() {
  const key = 'callio_afd51e229970eaf36e925c31a2417194336183f28728f2cd';
  const keyHash = hashApiKey(key);
  
  console.log('Key hash:', keyHash);
  
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { api: true, user: true }
  });
  
  if (apiKey) {
    console.log('\nAPI Key found:');
    console.log('- ID:', apiKey.id);
    console.log('- User:', apiKey.user?.email);
    console.log('- API Slug:', apiKey.api.slug);
    console.log('- API Name:', apiKey.api.name);
    console.log('- Created:', apiKey.createdAt);
  } else {
    console.log('\nAPI Key NOT found in database!');
  }
  
  const allApis = await prisma.api.findMany({ select: { slug: true, name: true } });
  console.log('\nAll APIs in database:');
  allApis.forEach(api => console.log(`- ${api.slug} (${api.name})`));
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
