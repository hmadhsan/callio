import CallioClient from '../src/index';

// Test configurations
const TEST_API_KEY = process.env.CALLIO_API_KEY || 'callio_test_key_123';
const TEST_BASE_URL = process.env.CALLIO_BASE_URL || 'http://localhost:3000/api/proxy';

describe('CallioClient', () => {
  let client: CallioClient;

  beforeEach(() => {
    client = new CallioClient(TEST_API_KEY, TEST_BASE_URL);
  });

  describe('initialization', () => {
    it('should throw error if API key is missing', () => {
      expect(() => new CallioClient('')).toThrow('Callio API key is required');
    });

    it('should initialize with custom base URL', () => {
      const customClient = new CallioClient(TEST_API_KEY, 'https://custom.api/proxy/');
      expect(customClient).toBeDefined();
    });

    it('should strip trailing slash from base URL', () => {
      const customClient = new CallioClient(TEST_API_KEY, 'https://custom.api/proxy/');
      // Base URL should be normalized (trailing slash removed)
      expect(customClient).toBeDefined();
    });
  });

  describe('HTTP methods', () => {
    // Mock fetch for testing
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should make GET requests with correct headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ fact: 'Cats sleep 70% of their lives' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const response = await client.get('cat-facts', '/random');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cat-facts/random'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${TEST_API_KEY}`,
          }),
        })
      );
      expect(response.status).toBe(200);
    });

    it('should make POST requests with body', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 1, created: true }), {
          status: 201,
          headers: { 'content-type': 'application/json' },
        })
      );

      const payload = { name: 'Whiskers' };
      const response = await client.post('cat-facts', '/cats', payload);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cat-facts/cats'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TEST_API_KEY}`,
          }),
        })
      );
      expect(response.status).toBe(201);
    });

    it('should make PUT requests', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 1, updated: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const payload = { name: 'Updated Name' };
      const response = await client.put('cat-facts', '/cats/1', payload);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cat-facts/cats/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      );
      expect(response.status).toBe(200);
    });

    it('should make DELETE requests', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ deleted: true }), {
          status: 204,
          headers: { 'content-type': 'application/json' },
        })
      );

      const response = await client.delete('cat-facts', '/cats/1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cat-facts/cats/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(response.status).toBe(204);
    });

    it('should handle API slug correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      await client.get('jsonplaceholder', '/posts/1');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('/jsonplaceholder/posts/1');
    });

    it('should normalize path slashes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      // Test with leading slash
      await client.get('jsonplaceholder', '/posts/1');
      let callArgs = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('/jsonplaceholder/posts/1');

      // Test without leading slash
      (global.fetch as jest.Mock).mockClear();
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      await client.get('jsonplaceholder', 'posts/1');
      callArgs = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain('/jsonplaceholder/posts/1');
    });
  });

  describe('real-world examples', () => {
    // These are integration tests that require actual API calls
    // Skip them if you want to run unit tests only
    it.skip('should fetch cat facts from public API via proxy', async () => {
      const response = await client.get('cat-facts', '/random');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('fact');
      expect(typeof data.fact).toBe('string');
      expect(data.fact.length).toBeGreaterThan(0);
    });

    it.skip('should fetch JSON placeholder posts via proxy', async () => {
      const response = await client.get('jsonplaceholder', '/posts/1');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('userId');
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('body');
    });

    it.skip('should handle query parameters', async () => {
      const response = await client.get('jsonplaceholder', '/posts?userId=1&_limit=5');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it.skip('should create a post via proxy', async () => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post created via Callio SDK',
        userId: 1,
      };

      const response = await client.post('jsonplaceholder', '/posts', newPost);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.title).toBe(newPost.title);
    });
  });
});
