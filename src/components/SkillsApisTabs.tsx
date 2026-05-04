'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Api {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
}

interface SkillsApisTabsProps {
  apis: Api[];
}

export default function SkillsApisTabs({ apis }: SkillsApisTabsProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'apis'>('skills');

  return (
    <section className="border-t border-gray-200 py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted Skills and APIs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The building blocks your agent needs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'skills'
                ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'apis'
                ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            APIs
          </button>
        </div>

        {/* Count Badge */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {apis.length} {activeTab} available
          </span>
        </div>

        {/* Content */}
        {activeTab === 'skills' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apis.map((api) => (
              <Link key={api.id} href={`/skills/callio/${api.slug}`}>
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition">
                    {api.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{api.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{api.description}</p>
                  <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                    {api.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apis.map((api) => (
              <Link key={api.id} href={`/skills/callio/${api.slug}`}>
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition">
                    {api.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{api.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{api.description}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    API
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/skills/callio">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg">
              Browse All {apis.length} {activeTab === 'skills' ? 'Skills' : 'APIs'}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
