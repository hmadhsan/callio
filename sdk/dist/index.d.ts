export declare class CallioClient {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    /**
     * Make a raw request through the Callio proxy
     */
    request(apiSlug: string, path: string, options?: RequestInit): Promise<Response>;
    /**
     * Helper for GET requests
     */
    get(apiSlug: string, path: string, options?: RequestInit): Promise<Response>;
    /**
     * Helper for POST requests
     */
    post(apiSlug: string, path: string, body?: any, options?: RequestInit): Promise<Response>;
    /**
     * Helper for PUT requests
     */
    put(apiSlug: string, path: string, body?: any, options?: RequestInit): Promise<Response>;
    /**
     * Helper for DELETE requests
     */
    delete(apiSlug: string, path: string, options?: RequestInit): Promise<Response>;
}
export default CallioClient;
