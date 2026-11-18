"use client";
import { useTranslations } from "next-intl";
import { ProductListingCard } from "@/components/product/product-listing-card";
import type { ListingRow } from "@/types/listing";

export default function ProductSectionSupplier({
  listings,
}: {
  listings: ListingRow[];
}) {
  const t = useTranslations("product");

  if (!listings.length) return null;

  return (
    <div className="w-full px-4 mt-20">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        {t.rich("supplierSectionTitle", {
          highlight: (chunks) => <span className="text-red-600">{chunks}</span>,
        })}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {listings.map((listing) => (
          <ProductListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
