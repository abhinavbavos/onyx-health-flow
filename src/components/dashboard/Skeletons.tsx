// Skeleton stat card placeholder
export const SkeletonCard = () => (
  <div className="skeleton-block rounded-[24px] p-5 h-[120px] flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="h-3 w-24 rounded-full bg-white/30" />
      <div className="h-10 w-10 rounded-full bg-white/20" />
    </div>
    <div>
      <div className="h-8 w-16 rounded-xl bg-white/30 mb-2" />
      <div className="h-2 w-20 rounded-full bg-white/20" />
    </div>
  </div>
);

// Skeleton table panel
export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white/50 backdrop-blur-md rounded-[24px] p-6 border border-white/60 shadow-sm">
    <div className="h-5 w-40 rounded-full bg-slate-200/80 mb-6 skeleton-block" />
    <div className="space-y-4">
      {/* Header row */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 rounded-full bg-slate-200/70 skeleton-block" />
        ))}
      </div>
      {/* Data rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 py-1">
          <div className="h-4 rounded-full bg-slate-100 skeleton-block" />
          <div className="h-4 w-3/4 rounded-full bg-slate-100 skeleton-block" />
          <div className="h-4 w-1/2 rounded-full bg-slate-100 skeleton-block" />
          <div className="h-6 w-16 rounded-full bg-slate-100 skeleton-block" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton stat cards grid
export const SkeletonStatGrid = ({ count = 4 }: { count?: number }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
