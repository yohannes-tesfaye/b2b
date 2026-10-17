import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { CheckCircle2, Globe, Star } from "lucide-react";
import { useLocale, useFormatter, useTranslations } from "next-intl";
import * as FlagComponents from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { ProductImage } from "./ProductImage";

const DEFAULT_TITLE = "Ceeport Medical Xeroform Petrolatum Dressing";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80";
const DEFAULT_COUNTRY = "China";
const DEFAULT_RATING = 3.5;

const CURRENCY_BY_LOCALE: Record<string, string> = {
  en: "USD",
  am: "ETB",
};

const flagComponents = FlagComponents as unknown as Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>;

export interface ProductCardProduct {
  title?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  country?: string;
  countryCode?: string;
  supplierName?: string;
  supplierLogo?: string;
  priceMin?: number;
  priceMax?: number;
  moq?: number;
  currency?: string;
  verified?: boolean;
}

export interface ProductCardProps {
  type?: "supplier" | "wanted";
  product?: ProductCardProduct;
  title?: string;
  rating?: number;
  country?: string;
  countryFlag?: string;
  imageUrl?: string;
  verified?: boolean;
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
  type = "wanted",
  product,
  title,
  rating,
  country,
  countryFlag,
  imageUrl,
  verified,
}: ProductCardProps) {
  const t = useTranslations("product");
  const format = useFormatter();
  const locale = useLocale();

  const resolvedTitle = product?.title ?? title ?? DEFAULT_TITLE;
  const resolvedImage = product?.image ?? imageUrl ?? DEFAULT_IMAGE;
  const resolvedRating = product?.rating ?? rating ?? DEFAULT_RATING;
  const resolvedCountry = product?.country ?? country ?? DEFAULT_COUNTRY;
  const resolvedVerified = product?.verified ?? verified ?? true;

  const resolvedCountryCode = product?.countryCode;
  const resolvedSupplierName = product?.supplierName;
  const resolvedSupplierLogo = product?.supplierLogo;
  const resolvedReviewCount = product?.reviewCount;
  const priceMin = product?.priceMin;
  const priceMax = product?.priceMax;
  const moq = product?.moq;

  const currency =
    product?.currency ?? CURRENCY_BY_LOCALE[locale] ?? "USD";

  const formattedRating = format.number(resolvedRating, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formattedReviewCount =
    resolvedReviewCount != null ? format.number(resolvedReviewCount) : null;

  const ratingAria = formattedReviewCount
    ? t("ratingLabelWithCount", {
        rating: formattedRating,
        count: formattedReviewCount,
      })
    : t("ratingLabel", { rating: formattedRating });

  const formattedPriceMin =
    priceMin != null
      ? format.number(priceMin, { style: "currency", currency })
      : null;
  const formattedPriceMax =
    priceMax != null
      ? format.number(priceMax, { style: "currency", currency })
      : null;

  let priceText: string | null = null;
  if (formattedPriceMin && formattedPriceMax) {
    priceText = t("priceRange", {
      min: formattedPriceMin,
      max: formattedPriceMax,
    });
  } else {
    priceText = formattedPriceMin ?? formattedPriceMax;
  }

  const moqText =
    moq != null ? t("moq", { quantity: format.number(moq) }) : null;

  return (
    <Card className="group flex flex-1 min-w-[260px] max-w-sm flex-col overflow-hidden transition-all duration-200 hover:shadow-md border-border bg-card">
      {/* Top Section: Tag */}
      <CardHeader className="flex flex-row items-center justify-between p-3.5 pb-2 space-y-0">
        <Badge
          variant={type === "wanted" ? "default" : "outline"}
          className={cn(
            "capitalize font-semibold text-xs",
            type === "wanted" &&
              "bg-blue-600 hover:bg-blue-700 text-white border-transparent"
          )}
        >
          {t(type)}
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 pt-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted mb-3">
            <ProductImage
              src={resolvedImage}
              alt={resolvedTitle}
              fallbackLabel={t("imageFallback")}
            />
            {resolvedVerified && (
              <Badge className="absolute bottom-2 left-2 bg-emerald-600/95 hover:bg-emerald-600 text-white backdrop-blur-sm text-[10px] px-2 py-0.5 gap-1 font-semibold border-none">
                <CheckCircle2 className="w-3 h-3" /> {t("verified")}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="sr-only">{ratingAria}</span>
            <div className="flex items-center" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(resolvedRating)
                      ? "fill-amber-400 text-amber-400"
                      : i < resolvedRating
                        ? "fill-amber-400/50 text-amber-400"
                        : "text-muted-foreground/30"
                  }`}
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

          {/* Title */}
          <h3
            className="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug hover:underline cursor-pointer mb-2 min-h-10"
            title={resolvedTitle}
          >
            {resolvedTitle}
          </h3>

          {/* Price range & MOQ */}
          {(priceText || moqText) && (
            <div className="mb-2 space-y-1">
              {priceText && (
                <p className="text-sm font-semibold text-card-foreground">
                  {priceText}
                </p>
              )}
              {moqText && (
                <p className="text-xs text-muted-foreground">{moqText}</p>
              )}
            </div>
          )}
        </div>

        {/* Country & Supplier */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
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
            <span className="font-medium">{resolvedCountry}</span>
          </div>
          {resolvedSupplierName && (
            <div className="flex min-w-0 items-center gap-1.5">
              {resolvedSupplierLogo && (
                <Image
                  src={resolvedSupplierLogo}
                  alt={t("supplierLogoAlt", { name: resolvedSupplierName })}
                  width={16}
                  height={16}
                  unoptimized
                  className="h-4 w-4 shrink-0 rounded-full object-cover"
                />
              )}
              <span className="truncate font-medium">
                {resolvedSupplierName}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="p-3.5 pt-3">
        <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-medium text-sm h-9">
          {t("contact")}
        </Button>
      </CardFooter>
    </Card>
  );
}
