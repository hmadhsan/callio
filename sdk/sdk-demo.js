#!/usr/bin/env node

/**
 * Callio SDK Demonstration - Cat Facts API Example
 *
 * This script demonstrates how to use the Callio SDK to fetch cat facts
 * from a public cat facts API through the Callio gateway.
 *
 * Usage:
 *   node sdk-demo.js
 *
 * Or with custom API key:
 *   CALLIO_API_KEY=callio_xxx node sdk-demo.js
 */

const CallioClient = require('./dist/index.js').default;

// Mock cat facts data for demonstration
const MOCK_CAT_FACTS = [
  'Cats spend 70% of their lives sleeping or in a doze.',
  'A cat has over 20 vocalizations, including the meow, purr, and hiss.',
  'Cats have a reflective layer behind their retinas called the tapetum lucidum.',
  'A cat\'s hearing is much more sensitive than humans and dogs.',
  'Cats have a specialized collarbone that allows them to squeeze through tight spaces.',
  'A cat\'s nose print is unique, like a human\'s fingerprint.',
  'Cats have scent glands in their cheeks, chin, forehead, flanks, paws, and the base of their tail.',
  'Cats have evolved to communicate with humans through meowing, which they don\'t do with each other.',
  'A cat can rotate its ears 180 degrees.',
  'The Turkish Van is one of the few cat breeds that enjoys swimming.',
];

async function demonstrateSDK() {
  const apiKey = process.env.CALLIO_API_KEY || 'callio_demo_key_123';

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║          Callio SDK Demonstration - Cat Facts API              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Initialize the client
    console.log('📌 Step 1: Initialize Callio Client');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`   Base URL: https://callio.dev/api/proxy\n`);

    const client = new CallioClient(apiKey);
    console.log('   ✅ Client initialized successfully\n');

    // 2. Show request structure
    console.log('📌 Step 2: Request Structure');
    console.log('   When you call: client.get("cat-facts", "/random")');
    console.log('   ');
    console.log('   It constructs:');
    console.log('   ├─ URL: https://callio.dev/api/proxy/cat-facts/random');
    console.log('   ├─ Method: GET');
    console.log('   └─ Headers:');
    console.log(`   │  ├─ Authorization: Bearer ${apiKey.substring(0, 10)}...`);
    console.log('   │  └─ Content-Type: application/json\n');

    // 3. Demonstrate how the request would be made
    console.log('📌 Step 3: Making Requests');
    console.log('   ');
    console.log('   Example 1: GET single cat fact');
    console.log('   ────────────────────────────────────');
    console.log('   const response = await client.get("cat-facts", "/random");');
    console.log('   const data = await response.json();\n');

    // Simulate response
    const fact = MOCK_CAT_FACTS[Math.floor(Math.random() * MOCK_CAT_FACTS.length)];
    console.log('   Response (200 OK):');
    console.log(`   {`);
    console.log(`     "fact": "${fact}"`);
    console.log(`   }\n`);

    // 4. Demonstrate multiple requests
    console.log('   Example 2: GET multiple cat facts');
    console.log('   ────────────────────────────────────');
    console.log('   const facts = [];');
    console.log('   for (let i = 0; i < 3; i++) {');
    console.log('     const response = await client.get("cat-facts", "/random");');
    console.log('     const data = await response.json();');
    console.log('     facts.push(data.fact);');
    console.log('   }\n');

    console.log('   Results:');
    for (let i = 0; i < 3; i++) {
      const randomFact = MOCK_CAT_FACTS[Math.floor(Math.random() * MOCK_CAT_FACTS.length)];
      console.log(`   ${i + 1}. ${randomFact}`);
    }
    console.log('');

    // 5. Demonstrate POST request
    console.log('   Example 3: POST request (JSONPlaceholder)');
    console.log('   ────────────────────────────────────────');
    console.log('   const response = await client.post("jsonplaceholder", "/posts", {');
    console.log('     title: "Learn about cats",');
    console.log('     body: "Cats are amazing creatures",');
    console.log('     userId: 1');
    console.log('   });\n');

    console.log('   Response (201 Created):');
    console.log(`   {`);
    console.log(`     "userId": 1,`);
    console.log(`     "id": 101,`);
    console.log(`     "title": "Learn about cats",`);
    console.log(`     "body": "Cats are amazing creatures"`);
    console.log(`   }\n`);

    // 6. Demonstrate PUT request
    console.log('   Example 4: PUT request (update)');
    console.log('   ───────────────────────────────');
    console.log('   const response = await client.put("jsonplaceholder", "/posts/1", {');
    console.log('     title: "Updated cat facts",');
    console.log('     body: "More amazing cat facts",');
    console.log('     userId: 1');
    console.log('   });\n');

    console.log('   Response (200 OK):');
    console.log(`   {`);
    console.log(`     "userId": 1,`);
    console.log(`     "id": 1,`);
    console.log(`     "title": "Updated cat facts",`);
    console.log(`     "body": "More amazing cat facts"`);
    console.log(`   }\n`);

    // 7. Demonstrate DELETE request
    console.log('   Example 5: DELETE request');
    console.log('   ─────────────────────────');
    console.log('   const response = await client.delete("jsonplaceholder", "/posts/1");\n');
    console.log('   Response (204 No Content)\n');

    // 8. Show error handling
    console.log('📌 Step 4: Error Handling');
    console.log('   ');
    console.log('   try {');
    console.log('     const response = await client.get("cat-facts", "/random");');
    console.log('     ');
    console.log('     if (!response.ok) {');
    console.log('       throw new Error(`HTTP ${response.status}`);\n');
    console.log('     }\n');
    console.log('     const data = await response.json();');
    console.log('   } catch (error) {');
    console.log('     console.error("Failed:", error.message);');
    console.log('   }\n');

    // 9. Show what the SDK handles for you
    console.log('📌 Step 5: What Callio SDK Handles');
    console.log('   ');
    console.log('   ✅ Automatic API key injection (Bearer token)');
    console.log('   ✅ URL normalization (trailing slashes, path joining)');
    console.log('   ✅ Automatic JSON serialization (request body)');
    console.log('   ✅ Proper Content-Type headers');
    console.log('   ✅ Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH)');
    console.log('   ✅ Native Fetch API Response object\n');

    // 10. Summary
    console.log('📌 Summary');
    console.log('   ');
    console.log('   The Callio SDK provides a simple, unified interface to call 140+ APIs');
    console.log('   without managing individual API keys or authentication methods.\n');
    console.log('   Benefits:');
    console.log('   • Single API key for all APIs');
    console.log('   • Unified error handling & responses');
    console.log('   • Automatic usage tracking');
    console.log('   • Provider credential management');
    console.log('   • Rate limit handling\n');

    // 11. Next steps
    console.log('📌 Next Steps');
    console.log('   ');
    console.log('   1. Generate an API key at https://callio.dev/signup');
    console.log('   2. Install the SDK: npm install callio-sdk');
    console.log('   3. Use it in your code:');
    console.log('   ');
    console.log('      import CallioClient from "callio-sdk";');
    console.log('      const client = new CallioClient(process.env.CALLIO_API_KEY);');
    console.log('      const resp = await client.get("cat-facts", "/random");');
    console.log('   ');
    console.log('   4. Read the full documentation: https://github.com/hmadhsan/callio\n');

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    Demo Completed Successfully                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the demonstration
demonstrateSDK();
