import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowUpRight, Camera, MapPin, Package, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryLabel, daysLeftLabel, typeLabel } from "@/lib/listings";
import type { ListingRow } from "@/types/listing";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80";

export function ProductListingCard({ listing }: { listing: ListingRow }) {
  const image = listing.images?.[0] || PLACEHOLDER;
  const isWanted = listing.type === "wanted";
  const priceLine = isWanted
    ? listing.budgetRange || "Budget on request"
    : listing.price || "Price on request";

  return (
    <Link href={`/products/${listing.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-card p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

          <Badge
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm ${
              isWanted
                ? "bg-blue-600 hover:bg-blue-600"
                : "bg-emerald-600 hover:bg-emerald-600"
            }`}
          >
            {typeLabel(listing.type)}
          </Badge>

          {listing.images && listing.images.length > 1 ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
              <Camera className="h-3 w-3" /> {listing.images.length}
            </span>
          ) : null}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white drop-shadow">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {categoryLabel(listing.category)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          </div>

          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
            {listing.title}
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          <div className="mt-auto space-y-2.5 pt-1">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {isWanted ? "Budget" : "Price"}
                </p>
                <p className="truncate text-base font-bold text-foreground">
                  {priceLine}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Qty
                </p>
                <p className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                  <Package className="h-3.5 w-3.5" /> {listing.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2.5">
              <span className="text-[11px] text-muted-foreground">
                {daysLeftLabel(listing.expiresAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                View details
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}