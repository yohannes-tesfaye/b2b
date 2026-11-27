"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Lock, Camera, MapPin, Eye, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { categoryLabel, daysLeft, effectiveStatus, LISTING_STATUS_META } from "@/lib/listings";
import { type PublicProfileListing } from "./types";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop&q=80";

export function ListingGridItem({
  listing,
  isPrivate = false,
  isOwner = false,
  showMetrics,
}: {
  listing: PublicProfileListing;
  isPrivate?: boolean;
  isOwner?: boolean;
  showMetrics?: boolean;
}) {
  const t = useTranslations("publicProfile");
  const image = listing.images?.[0] || PLACEHOLDER;
  const isWanted = listing.type === "wanted";

  const status = effectiveStatus(listing);
  const statusMeta = LISTING_STATUS_META[status as keyof typeof LISTING_STATUS_META];

  const days = daysLeft(listing.expiresAt);

  let daysLabel: string;
  if (days === null) {
    daysLabel = "-";
  } else if (days < 0) {
    daysLabel = t("listings.expired");
  } else if (days === 0) {
    daysLabel = t("listings.daysLeft", { days: 0 });
  } else {
    daysLabel = t("listings.daysLeft", { days });
  }

  const priceText = isWanted
    ? listing.budgetRange || t("listings.budgetOpen")
    : listing.price || t("listings.priceOnRequest");

  return (
    <Link
      href={`/products/${listing.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md sm:hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <Badge
            className={`absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm ${
              isWanted ? "bg-blue-600" : "bg-emerald-600"
            }`}
          >
            {isWanted ? t("listings.wanted") : t("listings.available")}
          </Badge>
          {listing.images && listing.images.length > 1 ? (
            <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur">
              <Camera className="h-2.5 w-2.5" /> {listing.images.length}
            </span>
          ) : null}
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
        </div>
        <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3">
          <h3 className="line-clamp-2 min-h-[2.4em] text-xs font-semibold sm:text-sm">
            {listing.title}
          </h3>
          {listing.category ? (
            <p className="line-clamp-1 text-[10px] text-brand sm:text-xs">
              {categoryLabel(listing.category)}
            </p>
          ) : null}
          <p className="text-xs font-semibold sm:text-sm">{priceText}</p>
          {listing.location ? (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <div className="min-w-0">
              {isPrivate ? (
                <Badge variant={statusMeta?.variant ?? "outline"} className="text-[9px]">
                  {t(`status.${status}` as never)}
                </Badge>
              ) : (
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {daysLabel}
                </span>
              )}
            </div>
            {isOwner && showMetrics !== false ? (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
                <span className="inline-flex items-center gap-0.5" aria-label={t("listings.views", { count: listing.views })}>
                  <Eye className="h-3 w-3" />
                  {listing.views}
                </span>
                <span className="inline-flex items-center gap-0.5" aria-label={t("listings.inquiries", { count: listing.inquiries })}>
                  <MessageSquare className="h-3 w-3" />
                  {listing.inquiries}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}