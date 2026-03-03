'use client';

import { Download } from 'lucide-react';

interface Parameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

interface Endpoint {
    id: string;
    method: string;
    path: string;
    description: string;
    parameters: Parameter[];
}

interface ApiInfo {
    slug: string;
    name: string;
    baseUrl?: string;
}

interface PostmanExportButtonProps {
    api: ApiInfo;
    endpoints: Endpoint[];
}

function buildPostmanCollection(api: ApiInfo, endpoints: Endpoint[]) {
    const baseUrl = api.baseUrl
        ? api.baseUrl.replace(/\/$/, '')
        : `https://callio.dev/api/proxy/${api.slug}`;

    const items = endpoints.map((ep) => {
        const hasBody = ['POST', 'PUT', 'PATCH'].includes(ep.method.toUpperCase());
        const queryParams = ep.parameters.filter(
            (p) => !hasBody || !p.required
        );
        const bodyParams = hasBody
            ? ep.parameters.filter((p) => p.required)
            : [];

        const url = `${baseUrl}${ep.path}`;

        return {
            name: ep.description || `${ep.method} ${ep.path}`,
            request: {
                method: ep.method.toUpperCase(),
                header: [
                    {
                        key: 'Authorization',
                        value: 'Bearer {{callio_api_key}}',
                        type: 'text',
                    },
                    {
                        key: 'Content-Type',
                        value: 'application/json',
                        type: 'text',
                    },
                ],
                url: {
                    raw: url,
                    protocol: url.startsWith('https') ? 'https' : 'http',
                    host: new URL(url).hostname.split('.'),
                    path: new URL(url).pathname.split('/').filter(Boolean),
                    query: queryParams.map((p) => ({
                        key: p.name,
                        value: `{{${p.name}}}`,
                        description: p.description,
                        disabled: !p.required,
                    })),
                },
                body: hasBody
                    ? {
                        mode: 'raw',
                        raw: JSON.stringify(
                            Object.fromEntries(
                                bodyParams.map((p) => [p.name, `<${p.type}>`])
                            ),
                            null,
                            2
                        ),
                        options: { raw: { language: 'json' } },
                    }
                    : undefined,
                description: ep.description,
            },
        };
    });

    return {
        info: {
            name: `${api.name} — via Callio`,
            description: `Auto-generated Postman collection for ${api.name} through the Callio API proxy.\n\nSet the {{callio_api_key}} variable to your Callio API key from https://callio.dev/keys`,
            schema:
                'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        auth: {
            type: 'bearer',
            bearer: [{ key: 'token', value: '{{callio_api_key}}', type: 'string' }],
        },
        variable: [
            {
                key: 'callio_api_key',
                value: '',
                description: 'Your Callio API key from https://callio.dev/keys',
            },
        ],
        item: items,
    };
}

export default function PostmanExportButton({ api, endpoints }: PostmanExportButtonProps) {
    const handleExport = () => {
        const collection = buildPostmanCollection(api, endpoints);
        const blob = new Blob([JSON.stringify(collection, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `callio-${api.slug}.postman_collection.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (endpoints.length === 0) return null;

    return (
        <button
            onClick={handleExport}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
            <Download className="w-4 h-4" />
            Export to Postman
        </button>
    );
}
