'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Loading API reference…
        </div>
    ),
});

interface OpenApiViewerProps {
    spec: Record<string, unknown>;
}

export default function OpenApiViewer({ spec }: OpenApiViewerProps) {
    return (
        <div className="openapi-viewer rounded-xl border border-gray-200 overflow-hidden bg-white">
            <style>{`
        /* Scope Swagger UI overrides inside our container */
        .openapi-viewer .swagger-ui .topbar { display: none }
        .openapi-viewer .swagger-ui .info { margin: 20px 0 10px }
        .openapi-viewer .swagger-ui .info .title { font-size: 1.25rem; font-weight: 700; color: #111827 }
        .openapi-viewer .swagger-ui .scheme-container { background: transparent; box-shadow: none; padding: 0 20px }
        .openapi-viewer .swagger-ui .opblock-tag { font-size: 0.95rem; font-weight: 600; color: #374151 }
        .openapi-viewer .swagger-ui .opblock { border-radius: 8px; margin-bottom: 8px; border: 1px solid #e5e7eb }
        .openapi-viewer .swagger-ui .opblock .opblock-summary { padding: 10px 15px }
        .openapi-viewer .swagger-ui .btn { border-radius: 6px }
        .openapi-viewer .swagger-ui .btn.authorize { background: #f97316; border-color: #f97316; color: #fff }
        .openapi-viewer .swagger-ui .responses-inner h4,
        .openapi-viewer .swagger-ui .responses-inner h5 { color: #374151 }
        .openapi-viewer .swagger-ui select,
        .openapi-viewer .swagger-ui input[type=text],
        .openapi-viewer .swagger-ui textarea { border-radius: 6px; border-color: #d1d5db }
      `}</style>
            <SwaggerUI
                spec={spec}
                docExpansion="list"
                defaultModelsExpandDepth={-1}
                tryItOutEnabled={false}
            />
        </div>
    );
}
