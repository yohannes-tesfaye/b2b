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
    <Link href={resolvedHref} className="block h-full w-full">
      <Card className="group flex h-full w-full flex-col gap-0 overflow-hidden rounded-xl bg-card p-0 ring-1 ring-border transition-all duration-200 hover:shadow-md sm:duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg sm:hover:ring-brand/40">
        {/* Desktop badge row */}
        <CardHeader className="hidden flex-row items-center justify-between space-y-0 px-4 pb-0 pt-4 sm:flex">
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

        {/* Mobile: horizontal (image left, content right). Desktop: vertical. */}
        <CardContent className="flex flex-1 flex-row gap-3 p-0 sm:flex-col sm:gap-0 sm:px-4 sm:pb-3 sm:pt-3">
          <div className="relative w-32 shrink-0 self-stretch overflow-hidden bg-muted sm:aspect-[4/3] sm:h-auto sm:w-full">
            <ProductImage
              src={resolvedImage}
              alt={resolvedTitle}
              fallbackLabel={t("imageFallback")}
            />
            {verified && (
              <Badge className="absolute bottom-1.5 left-1.5 gap-1 rounded-full border-0 bg-brand/95 p-1 text-[9px] font-semibold text-brand-foreground backdrop-blur-sm hover:bg-brand/95 sm:bottom-2 sm:left-2 sm:px-2 sm:py-0.5 sm:text-[10px]">
                <CheckCircle2 className="h-3 w-3" />
                <span className="hidden sm:inline">{t("verified")}</span>
              </Badge>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col py-3 pr-3 sm:py-0 sm:pr-0">
            {/* Mobile-only type badge + time left */}
            <div className="mb-1.5 flex items-center justify-between gap-2 sm:hidden">
              <Badge
                className={cn(
                  "rounded-full border-transparent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                  resolvedType === "wanted"
                    ? "bg-warm text-warm-foreground hover:bg-warm"
                    : "bg-brand text-brand-foreground hover:bg-brand"
                )}
              >
                {resolvedType === "wanted" ? t("wanted") : t("supplier")}
              </Badge>
              {resolvedTimeLeft && (
                <span className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground">
                  {resolvedTimeLeft}
                </span>
              )}
            </div>

            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="sr-only">{ratingAria}</span>
              <div className="flex items-center" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3 sm:h-3.5 sm:w-3.5",
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
                  className="hidden text-xs text-muted-foreground sm:inline"
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
              className="mb-2 line-clamp-2 min-h-0 text-sm font-semibold leading-snug text-card-foreground group-hover:underline sm:min-h-10"
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
              <div className="mt-auto flex items-end justify-between gap-3 pt-2 sm:mt-3 sm:pt-0">
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
                  <p className="hidden shrink-0 whitespace-nowrap text-[11px] text-muted-foreground sm:block">
                    {resolvedTimeLeft}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="hidden border-0 bg-transparent p-4 pt-0 sm:flex">
          <span className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-colors group-hover:bg-brand/90">
            {t("contact")}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
