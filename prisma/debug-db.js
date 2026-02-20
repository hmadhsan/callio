const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({ select: { id: true, email: true, name: true } });
  console.log('=== USERS ===');
  console.log(JSON.stringify(users, null, 2));
  
  const creds = await p.apiCredential.findMany({ 
    select: { id: true, userId: true, apiId: true, providerKey: true, createdAt: true },
  });
  console.log('\n=== CREDENTIALS ===');
  creds.forEach(c => { c.providerKey = c.providerKey.substring(0, 10) + '***'; });
  console.log(JSON.stringify(creds, null, 2));

  const keys = await p.apiKey.findMany({ 
    select: { id: true, userId: true, apiId: true, name: true, keyLast4: true, createdAt: true },
  });
  console.log('\n=== API KEYS ===');
  console.log(JSON.stringify(keys, null, 2));

  const openai = await p.api.findUnique({ 
    where: { slug: 'openai' }, 
    select: { id: true, slug: true, baseUrl: true, allowUnauthenticated: true, providerApiKey: true, providerAuthHeader: true, providerAuthScheme: true } 
  });
  console.log('\n=== OPENAI API RECORD ===');
  console.log(JSON.stringify(openai, null, 2));
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
