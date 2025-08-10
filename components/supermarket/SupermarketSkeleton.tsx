import { Skeleton } from "../ui/skeleton";

export function SupermarketSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Ordered Items Column */}
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={`ordered-${i}`}
                className="border rounded-lg p-6 opacity-75"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unordered Items Column */}
        <div className="flex-1">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={`unordered-${i}`} className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
