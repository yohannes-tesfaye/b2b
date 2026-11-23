"use client";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { PRODUCT_CARD_IMAGES } from "@/lib/product-demo";

export default function ProductSectionSupplier() {
  const t = useTranslations("product");

  const cards = [
    { id: "9", flag: "https://flagcdn.com/w40/et.png" },
    { id: "10", flag: "https://flagcdn.com/w40/et.png" },
    { id: "11", flag: "https://flagcdn.com/w40/et.png" },
    { id: "12", flag: "https://flagcdn.com/w40/et.png" },
  ] as const;

  return (
    <div className="container-wide">
      <header className="mb-8 text-center">
        <p className="type-caption text-brand">Available goods</p>
        <h2 className="type-section mt-2">
          {t.rich("supplierSectionTitle", {
            highlight: (chunks) => <span className="text-brand">{chunks}</span>,
          })}
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {cards.map((card) => (
          <ProductCard
            key={card.id}
            id={card.id}
            type="supplier"
            title={t(`cards.${card.id}.title`)}
            country={t(`cards.${card.id}.country`)}
            countryFlag={card.flag}
            imageUrl={PRODUCT_CARD_IMAGES[card.id]}
            rating={4.5 + Number(card.id) * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

