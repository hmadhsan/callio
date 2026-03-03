const { PrismaClient } = require('@prisma/client');
const batch1 = require('./new-apis-batch1').apis;
const batch2 = require('./new-apis-batch2').apis;

const newApis = [...batch1, ...batch2];
const prisma = new PrismaClient();

async function main() {
    console.log(`Starting to seed ${newApis.length} new APIs...`);
    let added = 0;
    let skipped = 0;

    for (const api of newApis) {
        // Check if it exists
        const existing = await prisma.api.findUnique({
            where: { slug: api.slug }
        });

        if (existing) {
            console.log(`Skipping ${api.slug} - already exists.`);
            skipped++;
            continue;
        }

        // Process endpoints before creation
        const endpointsToCreate = api.endpoints && api.endpoints.length > 0
            ? api.endpoints.map(e => ({
                method: e.method,
                path: e.path,
                description: e.description,
                parameters: e.parameters,
                responseExample: e.responseExample
            }))
            : [];

        await prisma.api.create({
            data: {
                slug: api.slug,
                name: api.name,
                category: api.category,
                icon: api.icon,
                featured: api.featured || false,
                shortDescription: api.shortDescription,
                fullDescription: api.fullDescription,
                useCases: api.useCases || [],
                documentation: api.documentation,
                authentication: api.authentication || 'API Key',
                allowUnauthenticated: api.allowUnauthenticated || false,
                rateLimit: api.rateLimit || 'Unknown',
                pricing: api.pricing || 'Unknown',
                webhook: api.webhook || false,
                setupGuide: api.setupGuide || null,
                setupUrl: api.setupUrl || null,
                endpoints: {
                    create: endpointsToCreate
                }
            }
        });
        console.log(`Added ${api.slug}`);
        added++;
    }

    console.log(`\nSeed completed! Added: ${added}, Skipped: ${skipped}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
