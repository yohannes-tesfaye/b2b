import { getTranslations } from "next-intl/server";
import { ProductCard } from "./ProductCard";
import { getPublishedListings } from "@/lib/public-listings";

/** Homepage "Wanted goods" section, backed by published DB listings. */
export default async function ProductSectionWanted() {
  const t = await getTranslations("product");
  const listings = await getPublishedListings("wanted", 4);

  return (
    <div className="container-wide py-(--section-space)">
      <header className="mb-(--spacing-12) text-center">
        <p className="type-caption text-warm">{t("wantedGoodsEyebrow")}</p>
        <h2 className="type-section mt-2">
          {t.rich("wantedSectionTitle", {
            highlight: (chunks) => <span className="text-warm">{chunks}</span>,
          })}
        </h2>
        <p className="type-body mt-3 text-muted-foreground">
          {t("wantedGoodsDescription")}
        </p>
      </header>
      {listings.length ? (
        <div className="grid grid-cols-1 gap-(--spacing-4) [&>*]:min-w-0 max-sm:[&>a]:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          {t("wantedGoodsEmpty")}
        </p>
      )}
    </div>
  );
}
