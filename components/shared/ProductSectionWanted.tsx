"use client";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { PRODUCT_CARD_IMAGES } from "@/lib/product-demo";

export default function ProductSectionWanted() {
  const t = useTranslations("product");

  const cards = [
    { id: "13", flag: "https://flagcdn.com/w40/ke.png" },
    { id: "14", flag: "https://flagcdn.com/w40/dj.png" },
    { id: "15", flag: "https://flagcdn.com/w40/ug.png" },
    { id: "16", flag: "https://flagcdn.com/w40/et.png" },
  ] as const;

  return (
    <div className="w-full px-4 mt-20">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        {t.rich("wantedSectionTitle", {
          highlight: (chunks) => (
            <span className="text-blue-600">{chunks}</span>
          ),
        })}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card) => (
          <ProductCard
            key={card.id}
            id={card.id}
            type="wanted"
            title={t(`cards.${card.id}.title`)}
            country={t(`cards.${card.id}.country`)}
            countryFlag={card.flag}
            imageUrl={PRODUCT_CARD_IMAGES[card.id]}
            rating={4.0 + Number(card.id) * 0.03}
          />
        ))}
      </div>
    </div>
  );
}

