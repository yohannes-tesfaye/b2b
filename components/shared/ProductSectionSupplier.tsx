import { getTranslations } from "next-intl/server";
import { ProductCard } from "./ProductCard";
import { getPublishedListings } from "@/lib/public-listings";

/** Homepage "Available goods" section, backed by published DB listings. */
export default async function ProductSectionSupplier() {
  const t = await getTranslations("product");
  const listings = await getPublishedListings("available", 4);

  return (
    <div className="container-wide py-(--section-space)">
      <header className="mb-(--spacing-12) text-center">
        <p className="type-caption text-brand">{t("availableGoodsEyebrow")}</p>
        <h2 className="type-section mt-2">
          {t.rich("supplierSectionTitle", {
            highlight: (chunks) => <span className="text-brand">{chunks}</span>,
          })}
        </h2>
      </header>
      {listings.length ? (
        <div className="grid grid-cols-1 gap-(--spacing-4) [&>*]:min-w-0 max-sm:[&>a]:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          {t("availableGoodsEmpty")}
        </p>
      )}
    </div>
  );
}
