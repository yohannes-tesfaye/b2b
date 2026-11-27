import { Skeleton } from "@/components/ui/skeleton";

export default function AdminListingDetailLoading() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Skeleton className="h-8 w-24" />

      <div className="relative overflow-hidden rounded-xl border">
        <div className="h-1 bg-muted" />
        <div className="space-y-3 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <Skeleton className="size-16 shrink-0 rounded-xl sm:size-20" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-7 w-72 max-w-full" />
              <Skeleton className="h-4 w-96 max-w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
