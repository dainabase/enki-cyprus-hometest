export function ProjectHeroSkeleton() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Skeleton Background avec gradient animé */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/20" />

      {/* Skeleton Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Location Badge Skeleton */}
        <div className="w-48 h-10 backdrop-blur-md bg-white/20 rounded-full mb-6 animate-pulse" />

        {/* Title Skeleton */}
        <div className="space-y-4 mb-6">
          <div className="w-96 h-12 bg-white/30 rounded-lg animate-pulse" />
          <div className="w-80 h-12 bg-white/25 rounded-lg animate-pulse" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-3 mb-12">
          <div className="w-[600px] h-6 bg-white/20 rounded-lg animate-pulse" />
          <div className="w-[500px] h-6 bg-white/20 rounded-lg animate-pulse" />
        </div>

        {/* CTA Buttons Skeleton */}
        <div className="flex gap-4">
          <div className="w-56 h-12 bg-white/30 rounded-lg animate-pulse" />
          <div className="w-52 h-12 bg-white/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* KPI Cards Skeleton - Fixed Bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="backdrop-blur-md bg-white/90 rounded-2xl p-6 shadow-xl animate-pulse"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-lg mb-4" />
                <div className="w-20 h-4 bg-gray-300 rounded mb-2" />
                <div className="w-24 h-6 bg-gray-400 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator Skeleton */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full animate-pulse" />
      </div>
    </section>
  );
}
