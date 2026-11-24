"use client";

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { CheckCircle2, Globe, Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import * as FlagComponents from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, daysLeftLabel } from "@/lib/listings";
import { countryCodeFromName } from "@/lib/countries";
import type { ListingRow } from "@/types/listing";
import { ProductImage } from "./ProductImage";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&auto=format&fit=crop&q=80";
const DEFAULT_RATING = 4.5;

const flagComponents = FlagComponents as unknown as Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>;

export interface ProductCardProps {
  id?: string;
  href?: string;
  type?: "supplier" | "available" | "wanted";
  title?: string;
  rating?: number;
  reviewCount?: number;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  imageUrl?: string;
  verified?: boolean;
  category?: string;
  quantity?: string;
  timeLeft?: string;
  /** Marketplace listing data; maps into the same shared card. */
  listing?: ListingRow;
}

function CountryFlag({ code }: { code: string }) {
  const normalized = code.trim().toUpperCase();
  if (!hasFlag(normalized)) {
    return null;
  }
  const Flag = flagComponents[normalized];
  if (!Flag) {
    return null;
  }
  return (
    <Flag
      className="h-3.5 w-5 shrink-0 rounded-[2px] border border-border object-cover"
      aria-hidden="true"
      focusable="false"
    />
  );
}

export function ProductCard({
  id,
  href,
  type = "supplier",
  title,
  rating,
  reviewCount,
  country,
  countryCode,
  countryFlag,
  imageUrl,
  verified = true,
  category,
  quantity,
  timeLeft,
  listing,
}: ProductCardProps) {
  const t = useTranslations("product");
  const format = useFormatter();

  const listingCountry = listing
    ? listing.originCountry?.trim() ||
      listing.location.split(",").pop()?.trim() ||
      listing.location
    : undefined;

  const resolvedId = listing?.id ?? id ?? "9";
  const resolvedHref = href ?? `/products/${resolvedId}`;
  const resolvedType = listing
    ? listing.type === "wanted"
      ? "wanted"
      : "supplier"
    : type === "wanted"
      ? "wanted"
      : "supplier";
  const resolvedTitle = listing?.title ?? title ?? t("demo.title");
  const resolvedImage = listing?.images?.[0] ?? imageUrl ?? DEFAULT_IMAGE;
  const resolvedRating = rating ?? DEFAULT_RATING;
  const resolvedCountry = listingCountry ?? country;
  const resolvedCountryCode =
    countryCode ?? countryCodeFromName(resolvedCountry);
  const resolvedCategory = listing
    ? listing.category
      ? categoryLabel(listing.category)
      : undefined
    : category;
  const resolvedQuantity = listing?.quantity || quantity;
  const timeLeftLabel = listing ? daysLeftLabel(listing.expiresAt) : timeLeft;
  const resolvedTimeLeft = timeLeftLabel === "—" ? undefined : timeLeftLabel;

  const formattedRating = format.number(resolvedRating, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formattedReviewCount =
    reviewCount != null ? format.number(reviewCount) : null;

  const ratingAria = formattedReviewCount
    ? t("ratingLabelWithCount", {
        rating: formattedRating,
        count: formattedReviewCount,
      })
    : t("ratingLabel", { rating: formattedRating });

  return (
    <Link href={resolvedHref} className="mx-auto block h-full w-full max-w-sm">
      <Card className="group flex h-full w-full flex-col gap-0 overflow-hidden rounded-xl bg-card p-0 ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0 pt-4">
          <Badge
            className={cn(
              "rounded-full border-transparent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              resolvedType === "wanted"
                ? "bg-warm text-warm-foreground hover:bg-warm"
                : "bg-brand text-brand-foreground hover:bg-brand"
            )}
          >
            {resolvedType === "wanted" ? t("wanted") : t("supplier")}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-3">
          <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <ProductImage
              src={resolvedImage}
              alt={resolvedTitle}
              fallbackLabel={t("imageFallback")}
            />
            {verified && (
              <Badge className="absolute bottom-2 left-2 gap-1 rounded-full border-0 bg-brand/95 px-2 py-0.5 text-[10px] font-semibold text-brand-foreground backdrop-blur-sm hover:bg-brand/95">
                <CheckCircle2 className="h-3 w-3" /> {t("verified")}
              </Badge>
            )}
          </div>

          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="sr-only">{ratingAria}</span>
            <div className="flex items-center" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(resolvedRating)
                      ? "fill-warm text-warm"
                      : i < resolvedRating
                        ? "fill-warm/60 text-warm"
                        : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span
              className="text-xs font-semibold text-muted-foreground"
              aria-hidden="true"
            >
              {formattedRating}
            </span>
            {formattedReviewCount && (
              <span
                className="text-xs text-muted-foreground"
                aria-hidden="true"
              >
                {t("reviewCount", { count: formattedReviewCount })}
              </span>
            )}
          </div>

          {resolvedCategory && (
            <p className="type-caption mb-1 text-[10px] text-brand">
              {resolvedCategory}
            </p>
          )}

          <h3
            className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-card-foreground group-hover:underline"
            title={resolvedTitle}
          >
            {resolvedTitle}
          </h3>

          {resolvedCountry && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {resolvedCountryCode ? (
                <CountryFlag code={resolvedCountryCode} />
              ) : countryFlag ? (
                <Image
                  src={countryFlag}
                  alt=""
                  width={20}
                  height={14}
                  unoptimized
                  aria-hidden="true"
                  className="h-3.5 w-5 shrink-0 rounded-[2px] border border-border object-cover"
                />
              ) : (
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="truncate font-medium">{resolvedCountry}</span>
            </div>
          )}

          {(resolvedQuantity || resolvedTimeLeft) && (
            <div className="mt-3 flex items-end justify-between gap-3">
              {resolvedQuantity && (
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {t("quantity")}
                  </p>
                  <p className="truncate text-xs font-semibold text-foreground">
                    {resolvedQuantity}
                  </p>
                </div>
              )}
              {resolvedTimeLeft && (
                <p className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
                  {resolvedTimeLeft}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-0 bg-transparent p-4 pt-0">
          <span className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-colors group-hover:bg-brand/90">
            {t("contact")}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
