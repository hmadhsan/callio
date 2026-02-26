"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallioClient = void 0;
class CallioClient {
    apiKey;
    baseUrl;
    constructor(apiKey, baseUrl = 'https://callio.dev/api/proxy') {
        if (!apiKey) {
            throw new Error('Callio API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    /**
     * Make a raw request through the Callio proxy
     */
    async request(apiSlug, path, options = {}) {
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
    async get(apiSlug, path, options) {
        return this.request(apiSlug, path, { ...options, method: 'GET' });
    }
    /**
     * Helper for POST requests
     */
    async post(apiSlug, path, body, options) {
        return this.request(apiSlug, path, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    /**
     * Helper for PUT requests
     */
    async put(apiSlug, path, body, options) {
        return this.request(apiSlug, path, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    /**
     * Helper for DELETE requests
     */
    async delete(apiSlug, path, options) {
        return this.request(apiSlug, path, { ...options, method: 'DELETE' });
    }
}
exports.CallioClient = CallioClient;
exports.default = CallioClient;
