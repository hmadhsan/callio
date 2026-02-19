#!/usr/bin/env node
// Reseed with production-ready APIs with proper authentication guides

const { PrismaClient } = require('@prisma/client');
const { apis } = require('./seed-data-production');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database reseed with production APIs...\n');

  try {
    // Delete existing data
    console.log('Deleting existing APIs and related data...');
    await prisma.apiCredential.deleteMany({});
    await prisma.apiKey.deleteMany({});
    await prisma.endpoint.deleteMany({});
    await prisma.api.deleteMany({});
    console.log('✓ Deleted all existing data\n');

    // Create new APIs
    console.log('Creating production-ready APIs:\n');
    for (const api of apis) {
      const createdApi = await prisma.api.create({
        data: {
          slug: api.slug,
          name: api.name,
          category: api.category,
          icon: api.icon,
          featured: api.featured || false,
          shortDescription: api.shortDescription,
          fullDescription: api.fullDescription,
          useCases: api.useCases,
          documentation: api.documentation,
          baseUrl: api.baseUrl,
          authentication: api.authentication,
          allowUnauthenticated: api.allowUnauthenticated || false,
          rateLimit: api.rateLimit,
          pricing: api.pricing,
          webhook: api.webhook || false,
          setupGuide: api.setupGuide || null,
          setupUrl: api.setupUrl || null,
        },
      });

      // Create endpoints for this API
      for (const endpoint of api.endpoints) {
        await prisma.endpoint.create({
          data: {
            apiId: createdApi.id,
            method: endpoint.method,
            path: endpoint.path,
            description: endpoint.description,
            parameters: endpoint.parameters,
            responseExample: endpoint.responseExample,
          },
        });
      }

      console.log(`✓ Created ${api.name}`);
    }

    console.log('\n✅ Database seeded with production APIs!');
    console.log(`Total APIs: ${apis.length}`);
    console.log('Total Endpoints: ' + apis.reduce((sum, api) => sum + api.endpoints.length, 0));
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
