import { ListingGridItem } from "./ListingGridItem";

interface ListingGridProps {
  listings: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    images: string[];
  }>;
  title?: string;
  emptyMessage?: string;
  isPrivate?: boolean;
}

export function ListingGrid({
  listings,
  title,
  emptyMessage = "No listings yet.",
  isPrivate = false,
}: ListingGridProps) {
  return (
    <div className="flex flex-col gap-3">
      {title ? (
        <h2 className="text-lg font-semibold">
          {title}
          {isPrivate ? (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (only visible to you)
            </span>
          ) : null}
        </h2>
      ) : null}

      {listings.length ? (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {listings.map((listing) => (
            <ListingGridItem
              key={listing.id}
              listing={listing}
              isPrivate={isPrivate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
