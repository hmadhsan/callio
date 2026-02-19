'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeExamplesProps {
  apiSlug: string;
  baseUrl?: string;
}

function SyntaxHighlightedCode({ code, language }: { code: string; language: string }) {
  if (language === 'curl') {
    return (
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {line.split(/('|"|\\|-H|Bearer|GET|POST|PUT|DELETE|https?:\/\/|curl)/g).map((part, j) => {
              if (['curl', '-H', 'GET', 'POST', 'PUT', 'DELETE'].includes(part)) {
                return <span key={j} className="text-cyan-400">{part}</span>;
              }
              if (part === '\\') return <span key={j} className="text-gray-400">{part}</span>;
              if (part?.startsWith('http')) return <span key={j} className="text-green-400">{part}</span>;
              if (part === 'Bearer' || part === 'Authorization') return <span key={j} className="text-orange-400">{part}</span>;
              if (['"', "'"].includes(part)) return <span key={j} className="text-green-300">{part}</span>;
              return <span key={j}>{part}</span>;
            })}
          </div>
        ))}
      </code>
    );
  }

  if (language === 'javascript') {
    return (
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {line.split(/(\bconst\b|\bawait\b|\bforeach\b|\bfetch\b|\bheaders\b|\bmethod\b|\bconsole\b|\bresponse\b|\bdata\b|\bJSON\b|\bBearer\b|'|"|Authorization|Content-Type|\{|\})/g).map((part, j) => {
              if (['const', 'await', 'fetch', 'console', 'async', 'function', 'return'].includes(part)) {
                return <span key={j} className="text-blue-400">{part}</span>;
              }
              if (['response', 'data', 'headers', 'method'].includes(part)) {
                return <span key={j} className="text-cyan-300">{part}</span>;
              }
              if (['{', '}'].includes(part)) return <span key={j} className="text-gray-300">{part}</span>;
              if (['"', "'"].includes(part)) return <span key={j} className="text-green-400">{part}</span>;
              if (['Authorization', 'Content-Type', 'Bearer', 'GET', 'POST'].includes(part)) {
                return <span key={j} className="text-yellow-400">{part}</span>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        ))}
      </code>
    );
  }

  if (language === 'python') {
    return (
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {line.split(/(\bimport\b|\brequests\b|\bheaders\b|\bresponse\b|\bdata\b|\bjson\b|\bprint\b|\bget\b|'|"|#|\{|\}|\=)/g).map((part, j) => {
              if (['import', 'def', 'for', 'if', 'return', 'class', 'from'].includes(part)) {
                return <span key={j} className="text-purple-400">{part}</span>;
              }
              if (['requests', 'headers', 'response', 'data', 'json', 'print', 'get'].includes(part)) {
                return <span key={j} className="text-cyan-300">{part}</span>;
              }
              if (['"', "'"].includes(part)) return <span key={j} className="text-green-400">{part}</span>;
              if (part === '#') return <span key={j} className="text-gray-500">{part}</span>;
              if (part === '=') return <span key={j} className="text-gray-300">{part}</span>;
              if (['Authorization', 'Content-Type', 'Bearer'].includes(part)) {
                return <span key={j} className="text-yellow-400">{part}</span>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        ))}
      </code>
    );
  }

  if (language === 'php') {
    return (
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {line.split(/(\?<|php|curl_init|curl_setopt|curl_exec|json_decode|curl_close|print_r|\$|=>|'|"|\(|\)|,|;|\{|\})/g).map((part, j) => {
              if (['php', 'curl_init', 'curl_setopt', 'curl_exec', 'json_decode', 'curl_close', 'print_r'].includes(part)) {
                return <span key={j} className="text-purple-400">{part}</span>;
              }
              if (part === '$') return <span key={j} className="text-cyan-400">{part}</span>;
              if (['"', "'"].includes(part)) return <span key={j} className="text-green-400">{part}</span>;
              if (['Authorization', 'Content-Type', 'Bearer', 'CURLOPT_URL', 'CURLOPT_RETURNTRANSFER'].includes(part)) {
                return <span key={j} className="text-yellow-400">{part}</span>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        ))}
      </code>
    );
  }

  return <code>{code}</code>;
}

export default function CodeExamples({ apiSlug, baseUrl }: CodeExamplesProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'javascript' | 'python' | 'php'>('curl');
  const [copied, setCopied] = useState(false);

  const proxyUrl = baseUrl 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://callio.app'}/api/proxy/${apiSlug}/forward?target=${encodeURIComponent(baseUrl + '/endpoint')}`
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://callio.app'}/api/proxy/${apiSlug}/endpoint`;

  const examples = {
    curl: `curl -X GET \\
  '${proxyUrl}' \\
  -H 'Authorization: Bearer YOUR_CALLIO_KEY' \\
  -H 'Content-Type: application/json'`,
    
    javascript: `const response = await fetch(
  '${proxyUrl}',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_CALLIO_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);`,
    
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_CALLIO_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    '${proxyUrl}',
    headers=headers
)

data = response.json()
print(data)`,
    
    php: `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, '${proxyUrl}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_CALLIO_KEY',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

print_r($data);`
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(examples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'curl', label: 'cURL', color: 'text-gray-600' },
    { id: 'javascript', label: 'JavaScript', color: 'text-yellow-600' },
    { id: 'python', label: 'Python', color: 'text-blue-600' },
    { id: 'php', label: 'PHP', color: 'text-purple-600' },
  ] as const;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Block */}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        
        <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm font-mono leading-relaxed">
          <SyntaxHighlightedCode code={examples[activeTab]} language={activeTab} />
        </pre>
      </div>

      {/* Hint */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Replace <code className="bg-blue-100 px-2 py-0.5 rounded">YOUR_CALLIO_KEY</code> with your actual Callio API key from the{' '}
          <a href="/keys" className="text-blue-700 underline hover:text-blue-800">
            dashboard
          </a>
          .
        </p>
      </div>
    </div>
  );
}
