export default function ApiLoadingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
          {/* Icon skeleton */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
          
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Category badge skeleton */}
          <div className="h-6 bg-gray-200 rounded-full w-24 mb-4"></div>
          
          {/* Button skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function CardLoadingSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
