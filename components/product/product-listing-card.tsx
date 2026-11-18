import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Globe, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { categoryLabel, daysLeftLabel, typeLabel } from "@/lib/listings";
import type { ListingRow } from "@/types/listing";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80";

export function ProductListingCard({ listing }: { listing: ListingRow }) {
  const image = listing.images?.[0] || PLACEHOLDER;
  const priceLine =
    listing.type === "available"
      ? listing.price || "Price on request"
      : listing.budgetRange || "Budget on request";

  return (
    <Link href={`/product/${listing.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Badge
            className={`absolute left-3 top-3 text-white shadow-md ${
              listing.type === "wanted"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {typeLabel(listing.type)}
          </Badge>
          <Badge className="absolute right-3 top-3 bg-background/90 text-foreground shadow-md backdrop-blur">
            {categoryLabel(listing.category)}
          </Badge>
          {listing.images && listing.images.length > 1 ? (
            <Badge className="absolute bottom-3 right-3 bg-black/60 text-white shadow-md backdrop-blur">
              {listing.images.length} photos
            </Badge>
          ) : null}
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {listing.description}
          </p>

          <div className="mt-auto space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{listing.location}</span>
              <span className="text-border">·</span>
              <span className="truncate">{listing.quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">{priceLine}</span>
              <span className="flex items-center gap-1 text-xs text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {daysLeftLabel(listing.expiresAt)}
              </span>
            </div>
          </div>
        </CardContent>

        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary">
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> View details
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </Card>
    </Link>
  );
}