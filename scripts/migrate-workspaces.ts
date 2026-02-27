import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting workspace migration...');
    const users = await prisma.user.findMany();
    let migratedCount = 0;

    for (const user of users) {
        let workspace = await prisma.workspace.findFirst({
            where: {
                members: { some: { userId: user.id, role: 'OWNER' } }
            }
        });

        if (!workspace) {
            workspace = await prisma.workspace.create({
                data: {
                    name: 'Personal Workspace',
                    slug: `personal-${user.id}`,
                    members: {
                        create: {
                            userId: user.id,
                            role: 'OWNER'
                        }
                    }
                }
            });
            console.log(`Created personal workspace for user: ${user.email}`);
        }

        // Migrate API Keys
        const keys = await prisma.apiKey.updateMany({
            where: { userId: user.id, workspaceId: null },
            data: { workspaceId: workspace.id }
        });
        if (keys.count > 0) console.log(`  - Migrated ${keys.count} API keys`);

        // Migrate Usage Records
        const logs = await prisma.usageRecord.updateMany({
            where: { userId: user.id, workspaceId: null },
            data: { workspaceId: workspace.id }
        });
        if (logs.count > 0) console.log(`  - Migrated ${logs.count} usage records`);

        // Migrate API Credentials
        const creds = await prisma.apiCredential.updateMany({
            where: { userId: user.id, workspaceId: null },
            data: { workspaceId: workspace.id }
        });
        if (creds.count > 0) console.log(`  - Migrated ${creds.count} API credentials`);

        migratedCount++;
    }

    console.log(`Successfully completed migration for ${migratedCount} users.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
