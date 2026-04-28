export default function ProductListSkeleton() {
  return (
    <div className="flex gap-6">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-5" />
          <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
          <div className="flex gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="h-3 bg-gray-100 rounded w-16 mb-3" />
          <div className="flex flex-col gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-24" />
            ))}
          </div>
          <div className="h-3 bg-gray-100 rounded w-12 mb-3" />
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-28" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
          <div className="h-9 bg-gray-200 rounded-xl w-36 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="bg-gray-100 h-52" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
