import ApiLoadingSkeleton from '@/components/LoadingSkeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation skeleton */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded"></div>
            <span className="text-lg font-bold">Callio</span>
          </div>
          <div className="text-xs text-gray-500">API Marketplace</div>
        </div>
      </nav>

      {/* Header skeleton */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96"></div>
        </div>
      </div>

      {/* API Grid skeleton */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApiLoadingSkeleton />
        </div>
      </section>
    </div>
  );
}
