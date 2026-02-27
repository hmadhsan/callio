import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInvites() {
    console.log("Checking recent invites...");
    const invites = await prisma.workspaceInvite.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    console.log("Invites:");
    console.dir(invites, { depth: null });
}

checkInvites().catch(console.error).finally(() => prisma.$disconnect());
