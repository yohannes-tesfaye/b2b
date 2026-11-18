import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Globe, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { categoryLabel, daysLeftLabel, typeLabel } from "@/lib/listings";
import type { ListingRow } from "@/types/listing";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80";

export function MarketplaceCard({ listing }: { listing: ListingRow }) {
  const image = listing.images?.[0] || PLACEHOLDER;
  const priceLine =
    listing.type === "available"
      ? listing.price || "Price on request"
      : listing.budgetRange || "Budget on request";

  return (
    <Link href={`/marketplace/${listing.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <Badge
            className={`absolute left-3 top-3 text-white ${
              listing.type === "wanted"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {typeLabel(listing.type)}
          </Badge>
        </div>
        <CardHeader className="space-y-1 p-4 pb-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {categoryLabel(listing.category)} · {listing.quantity}
          </p>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 p-4 pt-0 text-sm">
          <p className="line-clamp-2 text-muted-foreground">
            {listing.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span className="truncate">{listing.location}</span>
          </div>
          <p className="font-semibold text-foreground">{priceLine}</p>
        </CardContent>
        <CardFooter className="justify-between p-4 pt-0 text-xs text-muted-foreground">
          <span>{daysLeftLabel(listing.expiresAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Package className="h-3.5 w-3.5" /> View details
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}