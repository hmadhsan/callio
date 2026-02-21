const { PrismaClient } = require('@prisma/client');
const pc = new PrismaClient();
pc.api.findMany({ select: { slug: true, name: true, category: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); pc.$disconnect(); })
  .catch(e => { console.error(e); pc.$disconnect(); });
