const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.user.updateMany({
        where: { emailVerified: false },
        data: { emailVerified: true },
    });
    console.log(`Marked ${result.count} existing users as verified.`);
}

main().finally(() => prisma.$disconnect());
