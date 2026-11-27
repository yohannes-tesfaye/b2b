"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Lock, Package, Search } from "lucide-react";
import { ListingGridItem } from "./ListingGridItem";
import { type PublicProfileListing } from "./types";

interface ListingGridProps {
  listings: PublicProfileListing[];
  isPrivate?: boolean;
  isOwner?: boolean;
  showFilters?: boolean;
  sellerVerified?: boolean;
  sellerId?: string;
}

export function ListingGrid({
  listings,
  isPrivate = false,
  isOwner = false,
  showFilters = false,
  sellerVerified = false,
  sellerId,
}: ListingGridProps) {
  const t = useTranslations("publicProfile");
  const [filter, setFilter] = useState<"all" | "available" | "wanted">("all");

  const filtered =
    filter === "all" ? listings : listings.filter((l) => l.type === filter);

  const title = isPrivate
    ? t("listings.privateTitle")
    : t("listings.title");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {t("listings.count", { count: filtered.length })}
        </span>
      </div>

      {showFilters && listings.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "available", "wanted"] as const).map((key) => {
            const active = filter === key;
            const count =
              key === "all"
                ? listings.length
                : listings.filter((l) => l.type === key).length;
            const label =
              key === "all"
                ? t("listings.all")
                : key === "available"
                ? t("listings.available")
                : t("listings.wanted");
            return (
              <Button
                key={key}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className="shrink-0"
              >
                {label}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </Button>
            );
          })}
        </div>
      ) : null}

      {listings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center">
          {isPrivate ? (
            <Lock className="h-8 w-8 text-muted-foreground" />
          ) : (
            <Package className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isPrivate
              ? t("listings.privateEmpty")
              : isOwner
              ? t("listings.emptyOwner")
              : t("listings.emptyPublic")}
          </p>
          {!isPrivate && isOwner ? (
            <p className="text-xs text-muted-foreground">
              {t("listings.emptyOwnerHint")}
            </p>
          ) : null}
          {!isPrivate && !isOwner ? (
            <p className="text-xs text-muted-foreground">
              {t("listings.emptyPublicHint")}
            </p>
          ) : null}
          {!isPrivate && isOwner ? (
            <Button render={<Link href="/dashboard/listings/new" />} nativeButton={false}>
              {t("listings.postListing")}
            </Button>
          ) : null}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("listings.emptyFiltered")}
          </p>
          <Button variant="outline" onClick={() => setFilter("all")}>
            {t("listings.clearFilter")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
          {filtered.map((listing, index) => (
            <ListingGridItem
              key={listing.id}
              priority={index < 2}
              listing={listing}
              isPrivate={isPrivate}
              isOwner={isOwner}
              showMetrics={isOwner}
              sellerVerified={sellerVerified}
              sellerId={sellerId}
            />
          ))}
        </div>
      )}
    </div>
  );
}