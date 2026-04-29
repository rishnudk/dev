export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800
                    bg-gray-900 animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-800" />

      {/* Body skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <div>
              <div className="h-3 w-24 bg-gray-700 rounded mb-1" />
              <div className="h-2 w-16 bg-gray-800 rounded" />
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-xl" />
        </div>
        <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
        <div className="h-3 w-full bg-gray-800 rounded mb-1" />
        <div className="h-3 w-2/3 bg-gray-800 rounded" />
      </div>
    </div>
  )
}