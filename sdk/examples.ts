/**
 * Callio SDK Examples
 *
 * This file demonstrates how to use the CallioClient to interact with various APIs
 * through the Callio gateway. It includes examples for:
 * - Getting cat facts
 * - Managing JSON data
 * - Error handling
 */

import CallioClient from '../src/index';

// Initialize the client with your Callio API key
const client = new CallioClient(process.env.CALLIO_API_KEY || 'callio_your_key_here');

/**
 * Example 1: Get a random cat fact
 *
 * This example shows how to make a simple GET request through Callio
 * to fetch a random cat fact.
 */
export async function getCatFact() {
  try {
    console.log('📚 Fetching a random cat fact...');

    // Make a GET request to the cat-facts API via Callio proxy
    const response = await client.get('cat-facts', '/random');

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✨ Cat Fact:', data.fact);
    return data;
  } catch (error) {
    console.error('❌ Error fetching cat fact:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Example 2: Fetch multiple cat facts
 *
 * This example demonstrates making multiple requests and processing
 * the results as an array.
 */
export async function getMultipleCatFacts(count: number = 5) {
  try {
    console.log(`📚 Fetching ${count} cat facts...`);

    const facts = [];
    for (let i = 0; i < count; i++) {
      const response = await client.get('cat-facts', '/random');
      if (response.ok) {
        const data = await response.json();
        facts.push(data.fact);
        console.log(`  ${i + 1}. ${data.fact.substring(0, 60)}...`);
      }
    }

    return facts;
  } catch (error) {
    console.error('❌ Error fetching cat facts:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Example 3: Create a new post (JSONPlaceholder)
 *
 * This example shows how to make a POST request with a JSON payload
 * to create new data via the Callio proxy.
 */
export async function createPost(title: string, body: string, userId: number = 1) {
  try {
    console.log('📝 Creating a new post...');

    const response = await client.post('jsonplaceholder', '/posts', {
      title,
      body,
      userId,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✨ Post created with ID:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error creating post:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Example 4: Get a specific post and update it
 *
 * This example demonstrates reading data and then updating it
 * using PUT requests.
 */
export async function getAndUpdatePost(postId: number, newTitle: string, newBody: string) {
  try {
    // Get the post first
    console.log(`📖 Fetching post ${postId}...`);
    const getResponse = await client.get('jsonplaceholder', `/posts/${postId}`);

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch post: ${getResponse.status}`);
    }

    const originalPost = await getResponse.json();
    console.log('📖 Original post:', originalPost.title);

    // Update the post
    console.log('✏️ Updating post...');
    const updateResponse = await client.put(`jsonplaceholder`, `/posts/${postId}`, {
      ...originalPost,
      title: newTitle,
      body: newBody,
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update post: ${updateResponse.status}`);
    }

    const updatedPost = await updateResponse.json();
    console.log('✨ Post updated:', updatedPost.title);
    return updatedPost;
  } catch (error) {
    console.error('❌ Error updating post:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Example 5: Delete a post
 *
 * This example shows how to make a DELETE request to remove data.
 */
export async function deletePost(postId: number) {
  try {
    console.log(`🗑️ Deleting post ${postId}...`);

    const response = await client.delete('jsonplaceholder', `/posts/${postId}`);

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }

    console.log('✨ Post deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting post:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Example 6: Batch operations with error handling
 *
 * This example demonstrates how to handle multiple API calls
 * with proper error handling and retry logic.
 */
export async function batchCatFacts(count: number = 3, maxRetries: number = 2) {
  const results: Array<{ success: boolean; fact?: string; error?: string }> = [];

  for (let i = 0; i < count; i++) {
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        const response = await client.get('cat-facts', '/random');

        if (response.ok) {
          const data = await response.json();
          results.push({
            success: true,
            fact: data.fact,
          });
          success = true;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        } else {
          console.log(`⚠️ Retry ${retries}/${maxRetries} for fact ${i + 1}...`);
          await new Promise((r) => setTimeout(r, 1000)); // Wait 1s before retry
        }
      }
    }
  }

  return results;
}

/**
 * Example 7: Custom request with additional options
 *
 * This example shows how to use the raw request() method
 * for more control over headers and options.
 */
export async function customRequest() {
  try {
    console.log('🔧 Making custom request with custom headers...');

    const response = await client.request('jsonplaceholder', '/posts/1', {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'my-custom-value',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('✨ Response received:', data.title);
    return data;
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Main function to run all examples
 *
 * Note: Make sure you have set CALLIO_API_KEY environment variable
 */
async function main() {
  console.log('🚀 Callio SDK Examples\n');

  try {
    // Example 1: Single cat fact
    await getCatFact();
    console.log('---\n');

    // Example 2: Multiple cat facts
    const facts = await getMultipleCatFacts(3);
    console.log(`Got ${facts.length} facts\n---\n`);

    // Example 3: Create a post
    const post = await createPost('My First Post', 'This is a test post via Callio SDK');
    console.log('---\n');

    // Example 4: Update a post
    await getAndUpdatePost(1, 'Updated Title', 'Updated body content');
    console.log('---\n');

    // Example 5: Delete a post
    await deletePost(101);
    console.log('---\n');

    // Example 6: Batch with retries
    const batch = await batchCatFacts(2);
    console.log('Batch results:', batch);
    console.log('---\n');

    // Example 7: Custom request
    await customRequest();

    console.log('\n✅ All examples completed!');
  } catch (error) {
    console.error('\n❌ Example failed:', error);
    process.exit(1);
  }
}

// Run main if this file is executed directly
if (require.main === module) {
  main();
}

// Export all examples for use as a module
export {
  getCatFact,
  getMultipleCatFacts,
  createPost,
  getAndUpdatePost,
  deletePost,
  batchCatFacts,
  customRequest,
};
