import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearInvites() {
    console.log("Deleting hmadhsan97@gmail.com invites...");
    const result = await prisma.workspaceInvite.deleteMany({
        where: { email: 'hmadhsan97@gmail.com' }
    });
    console.log("Deleted count:", result.count);
}

clearInvites().catch(console.error).finally(() => prisma.$disconnect());
