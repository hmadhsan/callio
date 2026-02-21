'use client';

import { useState } from 'react';
import {
  Play,
  Copy,
  X,
  Loader,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointInfo {
  id: string;
  method: string;
  path: string;
  description: string;
  parameters: Parameter[];
}

interface ApiPlaygroundProps {
  apiSlug: string;
  endpoints: EndpointInfo[];
  baseUrl: string;
  allowUnauthenticated?: boolean;
  onClose?: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH: 'bg-purple-100 text-purple-700',
};

// Detect if a parameter is a chat messages field
const isChatMessages = (param: Parameter) =>
  param.name === 'messages' && param.type === 'array';

// Detect if a parameter is a simple string-list array (emails, to, cc, bcc, urls, ids, etc.)
const isSimpleListArray = (param: Parameter) =>
  param.type === 'array' &&
  ['to', 'cc', 'bcc', 'emails', 'urls', 'ids', 'text', 'texts', 'inputs'].includes(param.name);

// Detect boolean parameters
const isBooleanParam = (param: Parameter) =>
  param.type === 'boolean';

// Transform a raw user input into the correct value for the API
const transformParamValue = (param: Parameter, rawValue: string): unknown => {
  if (!rawValue) return undefined;
  const trimmed = rawValue.trim();

  // Chat messages: plain text → [{role: 'user', content: '...'}]
  if (isChatMessages(param)) {
    if (trimmed.startsWith('[')) {
      try { return JSON.parse(trimmed); } catch { /* fall through */ }
    }
    return [{ role: 'user', content: rawValue }];
  }

  // Simple list arrays: comma-separated → ["a", "b", "c"]
  if (isSimpleListArray(param)) {
    if (trimmed.startsWith('[')) {
      try { return JSON.parse(trimmed); } catch { /* fall through */ }
    }
    return rawValue.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Generic arrays/objects: try JSON parse
  if (param.type === 'array' || param.type === 'object') {
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try { return JSON.parse(trimmed); } catch { /* keep as string */ }
    }
    return rawValue;
  }

  // Numbers
  if ((param.type === 'number' || param.type === 'integer') && /^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  // Booleans
  if (param.type === 'boolean') {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    return undefined;
  }

  return rawValue;
};


export default function ApiPlayground({
  apiSlug,
  endpoints,
  baseUrl,
  allowUnauthenticated,
  onClose,
}: ApiPlaygroundProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo | null>(
    endpoints[0] || null
  );
  const [callioApiKey, setCallioApiKey] = useState('');
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!selectedEndpoint) {
    return (
      <div className="p-6 text-center text-gray-600">
        No endpoints available for this API
      </div>
    );
  }

  const buildUrl = () => {
    let url = `${baseUrl}${selectedEndpoint.path}`;
    Object.entries(parameters).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
    return url;
  };

  const buildCurlCommand = () => {
    // Build the Callio proxy URL
    let path = selectedEndpoint.path;
    Object.entries(parameters).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, value);
    });

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://callio.dev';
    let proxyUrl = `${origin}/api/proxy/${apiSlug}${path}`;
    // For GET requests, append parameters as query string
    if (['GET', 'DELETE', 'HEAD'].includes(selectedEndpoint.method)) {
      const qp = new URLSearchParams();
      for (const [key, value] of Object.entries(parameters)) {
        if (value && !selectedEndpoint.path.includes(`{${key}}`)) {
          qp.set(key, value);
        }
      }
      const qs = qp.toString();
      if (qs) proxyUrl += `?${qs}`;
    }
    let curl = `curl -X ${selectedEndpoint.method} "${proxyUrl}" \\`;
    curl += `\n  -H "Authorization: Bearer ${callioApiKey || 'YOUR_CALLIO_API_KEY'}" \\`;
    curl += `\n  -H "Content-Type: application/json"`;

    if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
      const parsedBody: Record<string, unknown> = {};
      for (const p of selectedEndpoint.parameters) {
        if (p.name.includes('{') || p.name.includes('}')) continue;
        const raw = parameters[p.name] || '';
        const val = transformParamValue(p, raw || 'example_value');
        if (val !== undefined) parsedBody[p.name] = val;
      }

      if (Object.keys(parsedBody).length > 0) {
        curl += ` \\`;
        curl += `\n  -d '${JSON.stringify(parsedBody)}'`;
      }
    }

    return curl;
  };

  const handleTestRequest = async () => {
    if (!callioApiKey) {
      setError('Please enter your Callio API key (from "Add to Agent" button)');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Build the path with parameters
      let path = selectedEndpoint.path;
      Object.entries(parameters).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value);
      });

      // Build the request body using smart parameter transforms
      let requestBody: string | undefined;
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        const parsed: Record<string, unknown> = {};
        for (const p of selectedEndpoint.parameters) {
          const raw = parameters[p.name];
          if (!raw) continue;
          const val = transformParamValue(p, raw);
          if (val !== undefined) parsed[p.name] = val;
        }
        requestBody = JSON.stringify(parsed);
      }

      // For GET/DELETE, append non-path parameters as query string
      let proxyPath = `/api/proxy/${apiSlug}${path}`;
      if (['GET', 'DELETE', 'HEAD'].includes(selectedEndpoint.method)) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(parameters)) {
          if (value && !selectedEndpoint.path.includes(`{${key}}`)) {
            queryParams.set(key, value);
          }
        }
        const qs = queryParams.toString();
        if (qs) proxyPath += `?${qs}`;
      }

      // Call through Callio's proxy
      const response = await fetch(proxyPath, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${callioApiKey}`,
        },
        body: requestBody,
      });

      // Handle non-JSON responses gracefully
      const responseText = await response.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText || '(empty response)' };
      }

      if (!response.ok) {
        // Convert error to string, handle various formats
        let errorMsg = typeof data.error === 'string'
          ? data.error
          : (data.message || JSON.stringify(data) || 'Request failed');

        // Check if it's a provider key issue
        if (errorMsg.includes('PROVIDER_KEY_MISSING') || data.code === 'PROVIDER_KEY_MISSING' || errorMsg.includes('Provider API key')) {
          errorMsg = `You haven't saved your provider API key yet. Scroll down to "Connect your provider key" and save your actual provider key (e.g. sk-... for OpenAI). Do NOT use your callio_ key there.`;
        } else if (data.code === 'PROVIDER_KEY_INVALID' || errorMsg.includes('provider key is invalid')) {
          errorMsg = `Your saved provider key is wrong (you may have accidentally saved your Callio key instead). Scroll down and re-save the correct provider key (e.g. sk-... for OpenAI).`;
        } else if (errorMsg.includes('Incorrect API key') || errorMsg.includes('invalid_api_key')) {
          errorMsg = `Your provider key is invalid. You may have saved your Callio key instead of your real provider key. Scroll down and re-save the correct key (e.g. sk-... for OpenAI).`;
        } else if (errorMsg.includes('Invalid or missing API key')) {
          errorMsg = `Invalid or expired Callio API key. Make sure you're using the callio_... key from the "Add to Agent" button.`;
        }
        setError(errorMsg);
      } else {
        setResponse({
          status: response.status,
          statusText: response.statusText,
          data,
          responseTime: 0, // Would need to track this
        });
      }
    } catch (err) {
      setError(`Error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildCurlCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-white shadow-2xl w-full h-full max-h-screen max-w-7xl flex flex-col">
        {/* Top Bar - Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">API Playground</h2>
            <span className="text-sm text-gray-500">• {apiSlug}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestRequest}
              disabled={loading || !callioApiKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2 text-sm"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Send Request
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Endpoints List */}
          <div className="w-72 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                Endpoints ({endpoints.length})
              </h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setSelectedEndpoint(endpoint);
                      setParameters({});
                      setResponse(null);
                      setError('');
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg transition border ${selectedEndpoint.id === endpoint.id
                      ? 'bg-white border-blue-300 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method] || 'bg-gray-100 text-gray-700'}`}>
                        {endpoint.method}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-gray-700 break-all">{endpoint.path}</div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">{endpoint.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Parameters & Input */}
          <div className="flex-1 border-r border-gray-200 overflow-y-auto p-6 bg-white">
            <div className="max-w-xl">
              {/* API Credentials */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">API Credentials</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Your Callio API Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={callioApiKey}
                    onChange={(e) => setCallioApiKey(e.target.value)}
                    placeholder="callio_..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {!allowUnauthenticated ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mt-3">
                      <p className="text-xs text-amber-900 font-bold mb-2">⚠️ IMPORTANT: Two-step process</p>
                      <ol className="text-xs text-amber-900 leading-relaxed space-y-2 ml-4 list-decimal">
                        <li><strong>First:</strong> Scroll down and use &quot;Save Provider Key&quot; to connect your provider account (e.g., OpenAI, Stripe)</li>
                        <li><strong>Then:</strong> Come back here and enter your Callio API key (from &quot;Add to Agent&quot; button) to test</li>
                      </ol>
                      <p className="text-xs text-amber-800 mt-3 italic">
                        Your Callio key tells our proxy which account to use. The proxy forwards requests using your saved provider key.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">
                      This is a free public API — just enter your Callio key and hit Send.
                    </p>
                  )}
                </div>
              </div>

              {/* Parameters */}
              {selectedEndpoint.parameters.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Parameters</h3>
                  <div className="space-y-5">
                    {selectedEndpoint.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                          {isChatMessages(param) ? 'message' : param.name}
                          {param.required && <span className="text-red-500 text-lg">*</span>}
                          <span className="text-xs text-gray-500 font-normal">
                            {isChatMessages(param) ? 'text' : isSimpleListArray(param) ? 'comma-separated' : param.type}
                          </span>
                        </label>

                        {/* Chat messages: simple textarea */}
                        {isChatMessages(param) ? (
                          <textarea
                            value={parameters[param.name] || ''}
                            onChange={(e) =>
                              setParameters({
                                ...parameters,
                                [param.name]: e.target.value,
                              })
                            }
                            placeholder="Type your message here..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          />
                        ) : isBooleanParam(param) ? (
                          /* Boolean: dropdown */
                          <select
                            value={parameters[param.name] || ''}
                            onChange={(e) =>
                              setParameters({
                                ...parameters,
                                [param.name]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="">— not set —</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : isSimpleListArray(param) ? (
                          /* Simple list arrays: plain text input */
                          <input
                            type="text"
                            value={parameters[param.name] || ''}
                            onChange={(e) =>
                              setParameters({
                                ...parameters,
                                [param.name]: e.target.value,
                              })
                            }
                            placeholder={param.description || `e.g. value1, value2, value3`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          /* Default input */
                          <input
                            type={param.type === 'number' || param.type === 'integer' ? 'number' : 'text'}
                            value={parameters[param.name] || ''}
                            onChange={(e) =>
                              setParameters({
                                ...parameters,
                                [param.name]: e.target.value,
                              })
                            }
                            placeholder={param.description}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          {isChatMessages(param)
                            ? 'Just type your message — we\'ll format it for the API automatically'
                            : isSimpleListArray(param)
                              ? `Separate multiple values with commas`
                              : param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errors */}
              {error && (
                <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Request Preview & Response */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
            {/* Request Preview */}
            <div className="flex-1 min-h-0 border-b border-gray-700 flex flex-col">
              <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <h3 className="text-sm font-bold text-gray-300 uppercase">Request Preview</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                  {buildCurlCommand()}
                </pre>
              </div>
            </div>

            {/* Response Display */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <h3 className="text-sm font-bold text-gray-300 uppercase">Response</h3>
                <div className="flex items-center gap-3">
                  {response && (
                    <>
                      <span className={`px-3 py-1 text-xs font-bold rounded ${response.status >= 200 && response.status < 300
                        ? 'bg-green-900/50 text-green-200'
                        : 'bg-red-900/50 text-red-200'
                        }`}>
                        {response.status}
                      </span>
                      <span className="text-xs text-gray-400">{response.responseTime}ms</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {response && !error ? (
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                ) : error ? (
                  <div className="space-y-3">
                    <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                      <p className="text-sm font-bold text-red-300 mb-2">❌ Request Failed</p>
                      <p className="text-sm text-red-200 leading-relaxed">{error}</p>
                    </div>
                    {!allowUnauthenticated && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                        <p className="text-sm font-bold text-yellow-300 mb-2">💡 Need your API key?</p>
                        <p className="text-sm text-yellow-200 leading-relaxed">
                          Click &quot;Get API Credentials&quot; button above to get instructions on how to obtain your actual provider API key.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Fill in parameters and click "Send Request"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
