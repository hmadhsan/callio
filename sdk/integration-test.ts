/**
 * Callio SDK Integration Tests
 *
 * These tests require a running Callio server and a valid API key.
 *
 * Run with:
 *   CALLIO_API_KEY=callio_xxx npx ts-node integration-test.ts
 */

import CallioClient from './src/index';

const apiKey = process.env.CALLIO_API_KEY;
const baseUrl = process.env.CALLIO_BASE_URL || 'https://callio.dev/api/proxy';

if (!apiKey) {
  console.error('❌ CALLIO_API_KEY environment variable is required');
  process.exit(1);
}

const client = new CallioClient(apiKey, baseUrl);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  console.log(`\n🧪 Testing: ${name}`);
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, duration });
    console.log(`   ✅ Passed (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMsg, duration });
    console.log(`   ❌ Failed: ${errorMsg}`);
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   Callio SDK Integration Test Suite                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`\nAPI Key: ${apiKey?.substring(0, 10)}...`);
  console.log(`Base URL: ${baseUrl}`);

  // Test 1: GET request to public API
  await runTest('GET request - Fetch cat fact', async () => {
    const response = await client.get('cat-facts', '/random');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.fact || typeof data.fact !== 'string') {
      throw new Error('Invalid response: missing fact property');
    }

    console.log(`   Fact: ${data.fact.substring(0, 60)}...`);
  });

  // Test 2: GET request with path
  await runTest('GET request - JSONPlaceholder post', async () => {
    const response = await client.get('jsonplaceholder', '/posts/1');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.id || !data.title) {
      throw new Error('Invalid response: missing required fields');
    }

    console.log(`   Post: ${data.title}`);
  });

  // Test 3: POST request
  await runTest('POST request - Create post', async () => {
    const payload = {
      title: 'Test Post via Callio SDK',
      body: 'This is a test post created via the Callio SDK',
      userId: 1,
    };

    const response = await client.post('jsonplaceholder', '/posts', payload);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error('Invalid response: missing id property');
    }

    console.log(`   Created post with ID: ${data.id}`);
  });

  // Test 4: PUT request
  await runTest('PUT request - Update post', async () => {
    const payload = {
      title: 'Updated via Callio SDK',
      body: 'Updated body content',
      userId: 1,
      id: 1,
    };

    const response = await client.put('jsonplaceholder', '/posts/1', payload);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.title !== payload.title) {
      throw new Error('Update failed: title mismatch');
    }

    console.log(`   Updated post: ${data.title}`);
  });

  // Test 5: DELETE request
  await runTest('DELETE request - Delete post', async () => {
    const response = await client.delete('jsonplaceholder', '/posts/1');

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP ${response.status}: expected 200 or 204`);
    }

    console.log(`   Deleted successfully (${response.status})`);
  });

  // Test 6: Multiple requests (batch)
  await runTest('Batch requests - Multiple cat facts', async () => {
    const facts = [];
    for (let i = 0; i < 3; i++) {
      const response = await client.get('cat-facts', '/random');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      facts.push(data.fact);
    }

    if (facts.length !== 3) {
      throw new Error(`Expected 3 facts, got ${facts.length}`);
    }

    console.log(`   Fetched ${facts.length} cat facts`);
  });

  // Test 7: Query parameters
  await runTest('Query parameters - List posts with limit', async () => {
    const response = await client.get('jsonplaceholder', '/posts?_limit=5&_start=0');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response: expected array of posts');
    }

    console.log(`   Fetched ${data.length} posts`);
  });

  // Test 8: Error handling - invalid API
  await runTest('Error handling - 404 Not Found', async () => {
    const response = await client.get('nonexistent-api', '/endpoint');

    if (response.ok) {
      throw new Error('Expected error response');
    }

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }

    console.log(`   Correctly returned ${response.status} for nonexistent API`);
  });

  // Print summary
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                        Test Summary                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Total: ${results.length} tests | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Total time: ${totalTime}ms\n`);

  // Show failed tests
  if (failed > 0) {
    console.log('❌ Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   • ${r.name}: ${r.error}`);
      });
    console.log();
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
