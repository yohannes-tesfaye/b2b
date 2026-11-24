"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Lock, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { typeLabel } from "@/lib/listings";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop&q=80";

interface ListingGridItem {
  id: string;
  title: string;
  type: string;
  status: string;
  images: string[];
}

export function ListingGridItem({
  listing,
  isPrivate = false,
}: {
  listing: ListingGridItem;
  isPrivate?: boolean;
}) {
  const image = listing.images?.[0] || PLACEHOLDER;
  const isWanted = listing.type === "wanted";

  return (
    <Link
      href={`/products/${listing.id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-muted"
    >
      <Image
        src={image}
        alt={listing.title}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Type badge */}
      <Badge
        className={`absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm ${
          isWanted ? "bg-blue-600" : "bg-emerald-600"
        }`}
      >
        {typeLabel(listing.type)}
      </Badge>

      {/* Image count */}
      {listing.images && listing.images.length > 1 ? (
        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur">
          <Camera className="h-2.5 w-2.5" /> {listing.images.length}
        </span>
      ) : null}

      {/* Private overlay */}
      {isPrivate ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-1">
            <Lock className="h-5 w-5 text-white/80" />
            <span className="text-[10px] font-medium text-white/80 capitalize">
              {listing.status}
            </span>
          </div>
        </div>
      ) : null}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-1.5">
        <p className="line-clamp-1 text-[10px] font-medium text-white drop-shadow">
          {listing.title}
        </p>
      </div>
    </Link>
  );
}
