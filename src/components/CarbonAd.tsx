'use client';

import { useEffect, useRef } from 'react';

export default function CarbonAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load the script once
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = '//cdn.carbonads.com/carbon.js?serve=CE7DP2QY&placement=calliodev'; // Example IDs
      script.id = '_carbonads_js';
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="carbon-ad-container mb-8 flex justify-center w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-gray-200 bg-white p-2/3 shadow-sm"
    />
  );
}
