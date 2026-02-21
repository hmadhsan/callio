const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.api.count().then(c => { console.log('Total APIs:', c); p.$disconnect(); });
