'use client';

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Lock,
  Camera,
  MapPin,
  Eye,
  MessageSquare,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations, useFormatter } from "next-intl";
import { startChatWithSeller } from "@/utils/inquiries/actions";
import {
  categoryLabel,
  daysLeft,
  effectiveStatus,
  LISTING_STATUS_META,
  DEFAULT_LISTING_RATING,
} from "@/lib/listings";
import { countryCodeFromName } from "@/lib/countries";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { type PublicProfileListing } from "./types";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop&q=80";

export function ListingGridItem({
  listing,
  isPrivate = false,
  isOwner = false,
  showMetrics = false,
  sellerVerified = false,
  sellerId,
  priority = false,
}: {
  listing: PublicProfileListing;
  isPrivate?: boolean;
  isOwner?: boolean;
  showMetrics?: boolean;
  sellerVerified?: boolean;
  sellerId?: string;
  priority?: boolean;
}) {
  const t = useTranslations("publicProfile");
  const format = useFormatter();
  const router = useRouter();
  const [isContacting, startContact] = useTransition();

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
  } else {
    daysLabel = t("listings.daysLeft", { days });
  }

  const priceText = isWanted
    ? listing.budgetRange || t("listings.budgetOpen")
    : listing.price || t("listings.priceOnRequest");

  const priceWithCurrency =
    !isWanted && listing.currency && listing.price
      ? `${listing.currency} ${listing.price}`
      : priceText;

  const countryName =
    listing.originCountry?.trim() ||
    listing.location.split(",").pop()?.trim() ||
    listing.location;
  const resolvedCountryCode =
    listing.countryCode || countryCodeFromName(countryName);
  const city =
    listing.location && listing.location !== countryName
      ? listing.location.replace(new RegExp(`,?\\s*${countryName}\\s*$`), "").trim()
      : "";

  const formattedRating = format.number(DEFAULT_LISTING_RATING, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const handleContact = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!sellerId) return;
    startContact(async () => {
      try {
        const result = await startChatWithSeller(sellerId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (result.redirectTo) {
          router.replace(result.redirectTo);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md sm:hover:-translate-y-0.5 sm:hover:ring-1 sm:hover:ring-brand/40">
      <Link
        href={`/products/${listing.id}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={listing.title}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

          <Badge
            className={`absolute left-1.5 top-1.5 rounded-full border-0 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm ${
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

          {sellerVerified && !isPrivate ? (
            <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-brand/95 px-1.5 py-0.5 text-[9px] font-semibold text-brand-foreground backdrop-blur sm:bottom-2 sm:left-2 sm:px-2 sm:py-0.5 sm:text-[10px]">
              <CheckCircle2 className="h-3 w-3" />
              <span className="hidden sm:inline">{t("header.verified")}</span>
            </span>
          ) : null}

          {!isWanted && listing.price ? (
            <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur sm:bottom-2 sm:right-2 sm:px-2 sm:text-[10px]">
              {priceWithCurrency}
            </span>
          ) : null}

          {isPrivate ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <div className="flex flex-col items-center gap-1">
                <Lock className="h-5 w-5 text-white/85" />
                <span className="text-[10px] font-medium text-white/85 capitalize">
                  {listing.status}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
          <div className="flex items-center gap-1">
            <span className="sr-only">
              {t("listings.rating", { rating: formattedRating })}
            </span>
            <div className="flex items-center" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    i < Math.floor(DEFAULT_LISTING_RATING)
                      ? "fill-warm text-warm"
                      : i < DEFAULT_LISTING_RATING
                      ? "fill-warm/60 text-warm"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground" aria-hidden="true">
              {formattedRating}
            </span>
          </div>

          {listing.category ? (
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand sm:text-[10px]">
              {categoryLabel(listing.category)}
            </p>
          ) : null}

          <h3
            className="line-clamp-2 min-h-[2.4em] text-[13px] font-semibold leading-snug text-card-foreground group-hover:underline sm:text-sm"
            title={listing.title}
          >
            {listing.title}
          </h3>

          <p className="text-[11px] font-semibold text-foreground sm:text-xs">
            {priceWithCurrency}
          </p>

          {countryName ? (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
              {resolvedCountryCode ? (
                <CountryFlag code={resolvedCountryCode} />
              ) : null}
              <span className="truncate font-medium">{countryName}</span>
              {city ? (
                <span className="hidden truncate text-muted-foreground/80 sm:inline">
                  · {city}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto flex flex-col gap-0.5 pt-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                {t("listings.quantity")}
              </p>
              <p className="truncate text-[11px] font-semibold text-foreground sm:text-xs">
                {listing.quantity || "-"}
              </p>
            </div>
            <p className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground sm:text-[11px]">
              {isPrivate ? (
                <Badge variant={statusMeta?.variant ?? "outline"} className="text-[9px]">
                  {t(`status.${status}` as never)}
                </Badge>
              ) : (
                daysLabel
              )}
            </p>
          </div>

          {isOwner && showMetrics ? (
            <div className="flex items-center gap-3 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {listing.views}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {listing.inquiries}
              </span>
            </div>
          ) : null}
        </div>
      </Link>

      {sellerId ? (
        <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3">
          {isOwner ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/dashboard/listings/${listing.id}/edit`);
              }}
            >
              {t("listings.edit")}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="h-9 w-full text-xs"
              disabled={isContacting}
              onClick={handleContact}
            >
              {isContacting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  {t("listings.contacting")}
                </>
              ) : (
                t("listings.contact")
              )}
            </Button>
          )}
        </div>
      ) : null}
    </article>
  );
}
