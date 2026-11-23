import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowUpRight, Camera, MapPin, Package, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryLabel, daysLeftLabel, typeLabel } from "@/lib/listings";
import type { ListingRow } from "@/types/listing";
import { cn } from "cn";
import { FavoriteButton } from "@/components/product/favorite-button";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80";

export function ProductListingCard({
  listing,
  orientation = "default",
}: {
  listing: ListingRow;
  orientation?: "default" | "tile";
}) {
  const image = listing.images?.[0] || PLACEHOLDER;
  const isWanted = listing.type === "wanted";
  const isTile = orientation === "tile";
  const priceLine = isWanted
    ? listing.budgetRange || "Budget on request"
    : listing.price || "Price on request";

  return (
    <Link href={`/products/${listing.id}`} className="group block h-full">
      <Card
        className={cn(
          "flex h-full gap-0 overflow-hidden rounded-2xl border-border/60 bg-card p-0 transition-all duration-300 active:scale-[0.99] sm:flex-col sm:hover:-translate-y-1 sm:hover:border-primary/40 sm:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]",
          isTile ? "flex-col" : "flex-row"
        )}
      >
        {/* Image */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-muted",
            isTile
              ? "aspect-[16/10] w-full"
              : "w-32 self-stretch sm:aspect-[4/3] sm:w-full sm:self-auto"
          )}
        >
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes={
              isTile
                ? "(max-width: 640px) 300px, (max-width: 1200px) 50vw, 25vw"
                : "(max-width: 640px) 128px, (max-width: 1200px) 50vw, 25vw"
            }
            className="object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
            unoptimized
            loading="eager"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0",
              !isTile && "hidden sm:block"
            )}
          />

          <Badge
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:text-[11px] ${
              isWanted ? "bg-blue-600 hover:bg-blue-600" : "bg-emerald-600 hover:bg-emerald-600"
            }`}
          >
            {typeLabel(listing.type)}
          </Badge>

          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <FavoriteButton listingId={listing.id} size="sm" />
          </div>

          {listing.images && listing.images.length > 1 ? (
            <span
              className={cn(
                "absolute right-2 bottom-2 items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur",
                isTile ? "inline-flex" : "hidden sm:inline-flex"
              )}
            >
              <Camera className="h-3 w-3" /> {listing.images.length}
            </span>
          ) : null}

          <div
            className={cn(
              "absolute bottom-2 left-2 items-center gap-1 text-xs font-medium text-white drop-shadow",
              isTile ? "flex" : "hidden sm:flex"
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary sm:text-[11px]">
              {categoryLabel(listing.category)}
            </span>
            <span className="hidden items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 sm:inline-flex">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors sm:text-[15px] sm:group-hover:text-primary">
            {listing.title}
          </h3>

          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {listing.description}
          </p>

          <div className="mt-auto space-y-2 pt-1">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                  {isWanted ? "Budget" : "Price"}
                </p>
                <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground sm:text-base">
                  {priceLine}
                </p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                  Qty
                </p>
                <p className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground sm:text-xs">
                  <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {listing.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t pt-2">
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground sm:text-[11px]">
                <span className="flex min-w-0 items-center gap-1 sm:hidden">
                  <Package className="h-3 w-3 shrink-0" />
                  <span className="truncate">{listing.quantity}</span>
                  <span aria-hidden className="px-0.5">
                    ·
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  {daysLeftLabel(listing.expiresAt)}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary sm:text-xs">
                <span className="hidden sm:inline">View details</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 sm:h-3.5 sm:w-3.5 sm:group-hover:translate-x-0.5 sm:group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}