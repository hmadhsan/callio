import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-blue-100">Everything you need to integrate Callio APIs in minutes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="sticky top-4 space-y-1">
              <a href="#quickstart" className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">Quick Start</a>
              <a href="#authentication" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Authentication</a>
              <a href="#proxy" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Using the Proxy</a>
              <a href="#examples" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Code Examples</a>
              <a href="#errors" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Error Handling</a>
              <a href="#rate-limits" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">Rate Limits</a>
              <a href="#faq" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">FAQ</a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Quick Start */}
            <section id="quickstart" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🚀 Quick Start</h2>
              <p className="text-lg text-gray-600 mb-6">Get started with Callio in 3 simple steps:</p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 1: Sign Up & Get Your API Key</h3>
                  <p className="text-gray-600 mb-3">Create an account and generate your Callio API key from the dashboard.</p>
                  <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                    Get Started →
                  </Link>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 2: Browse APIs</h3>
                  <p className="text-gray-600 mb-3">Explore our marketplace and find the APIs you need.</p>
                  <Link href="/skills/callio" className="text-purple-600 hover:text-purple-700 font-medium">
                    Browse APIs →
                  </Link>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 3: Make Your First Call</h3>
                  <p className="text-gray-600 mb-3">Use your Callio key to call any API through our proxy.</p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X GET \\
  'https://callio.app/api/proxy/{api-slug}/endpoint' \\
  -H 'Authorization: Bearer YOUR_CALLIO_KEY'`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🔐 Authentication</h2>
              <p className="text-gray-600 mb-6">All API requests must include your Callio API key in the Authorization header.</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm font-medium text-blue-900">Your API key starts with <code className="bg-blue-100 px-2 py-1 rounded">callio_</code></p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">Authentication Methods</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bearer Token (Recommended)</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`Authorization: Bearer callio_your_api_key_here`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Custom Header</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`X-Callio-Key: callio_your_api_key_here`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Using the Proxy */}
            <section id="proxy" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🌐 Using the Proxy</h2>
              <p className="text-gray-600 mb-6">The Callio proxy forwards your requests to the target API and returns the response.</p>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Proxy URL Structure</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`https://callio.app/api/proxy/{api-slug}/{endpoint-path}?your=params`}
              </pre>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold text-gray-900">{`{api-slug}`}</span>
                  <p className="text-gray-600">The unique identifier for the API (found on the API detail page)</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{`{endpoint-path}`}</span>
                  <p className="text-gray-600">The specific endpoint you want to call</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">Dynamic Target (Advanced)</h3>
              <p className="text-gray-600 mb-3">For APIs that allow it, you can specify a custom target URL:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`https://callio.app/api/proxy/{api-slug}/forward?target=https://api.example.com/endpoint`}
              </pre>
            </section>

            {/* Code Examples */}
            <section id="examples" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">💻 Code Examples</h2>
              
              {/* JavaScript */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-yellow-500 mr-2">●</span>
                  JavaScript / Node.js
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`const response = await fetch(
  'https://callio.app/api/proxy/search-discovery/search',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer callio_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);`}
                </pre>
              </div>

              {/* Python */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-blue-500 mr-2">●</span>
                  Python
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import requests

headers = {
    'Authorization': 'Bearer callio_your_api_key_here',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://callio.app/api/proxy/search-discovery/search',
    headers=headers
)

data = response.json()
print(data)`}
                </pre>
              </div>

              {/* cURL */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-gray-500 mr-2">●</span>
                  cURL
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X GET \\
  'https://callio.app/api/proxy/search-discovery/search' \\
  -H 'Authorization: Bearer callio_your_api_key_here' \\
  -H 'Content-Type: application/json'`}
                </pre>
              </div>

              {/* PHP */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-purple-500 mr-2">●</span>
                  PHP
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 
  'https://callio.app/api/proxy/search-discovery/search');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer callio_your_api_key_here',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

print_r($data);`}
                </pre>
              </div>
            </section>

            {/* Error Handling */}
            <section id="errors" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">⚠️ Error Handling</h2>
              <p className="text-gray-600 mb-6">The API uses standard HTTP status codes to indicate success or failure.</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 p-4">
                  <h4 className="font-semibold text-green-900">200 OK</h4>
                  <p className="text-green-800 text-sm">Request succeeded</p>
                </div>

                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">401 Unauthorized</h4>
                  <p className="text-red-800 text-sm">Invalid or missing API key</p>
                </div>

                <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                  <h4 className="font-semibold text-orange-900">400 Bad Request</h4>
                  <p className="text-orange-800 text-sm">Invalid request parameters or missing provider key</p>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                  <h4 className="font-semibold text-purple-900">404 Not Found</h4>
                  <p className="text-purple-800 text-sm">API or endpoint not found</p>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                  <h4 className="font-semibold text-yellow-900">429 Too Many Requests</h4>
                  <p className="text-yellow-800 text-sm">Rate limit exceeded</p>
                </div>

                <div className="border-l-4 border-gray-500 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">500 Server Error</h4>
                  <p className="text-gray-800 text-sm">Something went wrong on our end</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Error Response Format</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}`}
              </pre>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">⚡ Rate Limits</h2>
              <p className="text-gray-600 mb-6">Rate limits are applied per API key to ensure fair usage.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Free Tier</h4>
                  <p className="text-3xl font-bold text-blue-600">1,000</p>
                  <p className="text-sm text-gray-600">requests / month</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Pro Tier</h4>
                  <p className="text-3xl font-bold text-purple-600">100,000</p>
                  <p className="text-sm text-gray-600">requests / month</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
                  <p className="text-3xl font-bold text-green-600">Unlimited</p>
                  <p className="text-sm text-gray-600">custom pricing</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Rate limit information is included in response headers: 
                  <code className="bg-blue-100 px-2 py-1 rounded mx-1">X-RateLimit-Remaining</code> and 
                  <code className="bg-blue-100 px-2 py-1 rounded mx-1">X-RateLimit-Reset</code>
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">❓ FAQ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need separate API keys for each API?</h3>
                  <p className="text-gray-600">No! One Callio key works for all APIs in our marketplace. That's the whole point.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What if an API requires a provider key?</h3>
                  <p className="text-gray-600">Some APIs require you to bring your own provider key (BYOK). You can add these securely in your dashboard on the API detail page.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use Callio in production?</h3>
                  <p className="text-gray-600">Absolutely! Callio is built for production use with high availability and reliability.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I secure my API key?</h3>
                  <p className="text-gray-600">Never commit API keys to version control. Use environment variables and keep your keys in secure storage. You can revoke and regenerate keys anytime from your dashboard.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I hit my rate limit?</h3>
                  <p className="text-gray-600">You'll receive a 429 Too Many Requests response. Upgrade your plan for higher limits.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you log my API requests?</h3>
                  <p className="text-gray-600">We only log metadata (timestamps, status codes) for analytics and debugging. We never log request/response bodies.</p>
                </div>
              </div>
            </section>

            {/* Need Help */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="mb-6">Can't find what you're looking for? We're here to help!</p>
              <div className="flex gap-4">
                <Link href="mailto:support@callio.app" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Contact Support
                </Link>
                <Link href="/skills/callio" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                  Browse APIs
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
