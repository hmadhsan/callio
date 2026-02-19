import { CardLoadingSkeleton } from '@/components/LoadingSkeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-purple-200 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-blue-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Stats Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl h-32"></div>
            ))}
          </div>

          {/* Keys List skeleton */}
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <CardLoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
