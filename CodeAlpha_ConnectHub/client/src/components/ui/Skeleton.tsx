export function SkeletonFeed() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="panel p-5">
          <div className="flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
