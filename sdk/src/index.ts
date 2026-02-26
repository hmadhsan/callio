export class CallioClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'https://callio.dev/api/proxy') {
        if (!apiKey) {
            throw new Error('Callio API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    /**
     * Make a raw request through the Callio proxy
     */
    async request(apiSlug: string, path: string, options: RequestInit = {}): Promise<Response> {
        const url = `${this.baseUrl}/${apiSlug}/${path.replace(/^\//, '')}`;

        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${this.apiKey}`);
        if (!headers.has('Content-Type') && options.body) {
            headers.set('Content-Type', 'application/json');
        }

        return fetch(url, {
            ...options,
            headers,
        });
    }

    /**
     * Helper for GET requests
     */
    async get(apiSlug: string, path: string, options?: RequestInit): Promise<Response> {
        return this.request(apiSlug, path, { ...options, method: 'GET' });
    }

    /**
     * Helper for POST requests
     */
    async post(apiSlug: string, path: string, body?: any, options?: RequestInit): Promise<Response> {
        return this.request(apiSlug, path, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Helper for PUT requests
     */
    async put(apiSlug: string, path: string, body?: any, options?: RequestInit): Promise<Response> {
        return this.request(apiSlug, path, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Helper for DELETE requests
     */
    async delete(apiSlug: string, path: string, options?: RequestInit): Promise<Response> {
        return this.request(apiSlug, path, { ...options, method: 'DELETE' });
    }
}

export default CallioClient;
