"use client";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { PRODUCT_CARD_IMAGES } from "@/lib/product-demo";
import { SUPPLIER_LISTINGS } from "@/lib/config/supplier-listings";

/** Homepage "Available goods" preview grid. Card facts live in lib/config. */
export default function ProductSectionSupplier() {
  const t = useTranslations("product");

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
      <div className="grid grid-cols-1 gap-(--spacing-4) [&>*]:min-w-0 max-sm:[&>a]:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SUPPLIER_LISTINGS.map((card) => (
          <ProductCard
            key={card.id}
            id={card.id}
            type="supplier"
            title={t(`cards.${card.id}.title`)}
            country={t(`cards.${card.id}.country`)}
            countryCode={card.countryCode}
            imageUrl={PRODUCT_CARD_IMAGES[card.id]}
            rating={card.rating}
            category={card.category}
            quantity={card.quantity}
            timeLeft={card.timeLeft}
          />
        ))}
      </div>
    </div>
  );
}
