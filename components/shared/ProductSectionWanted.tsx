"use client";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { PRODUCT_CARD_IMAGES } from "@/lib/product-demo";

export default function ProductSectionWanted() {
  const t = useTranslations("product");

  const cards = [
    {
      id: "13",
      flag: "https://flagcdn.com/w40/ke.png",
      category: "Pulses",
      quantity: "500 drums",
      timeLeft: "14 days left",
    },
    {
      id: "14",
      flag: "https://flagcdn.com/w40/dj.png",
      category: "Food & beverage",
      quantity: "1,200 cases",
      timeLeft: "9 days left",
    },
    {
      id: "15",
      flag: "https://flagcdn.com/w40/ug.png",
      category: "Fresh produce",
      quantity: "800 crates",
      timeLeft: "7 days left",
    },
    {
      id: "16",
      flag: "https://flagcdn.com/w40/et.png",
      category: "Spices",
      quantity: "300 kg",
      timeLeft: "21 days left",
    },
  ] as const;

  return (
    <div className="container-wide">
      <header className="mb-8 text-center">
        <p className="type-caption text-warm">Wanted goods</p>
        <h2 className="type-section mt-2">
          {t.rich("wantedSectionTitle", {
            highlight: (chunks) => <span className="text-warm">{chunks}</span>,
          })}
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
            category={card.category}
            quantity={card.quantity}
            timeLeft={card.timeLeft}
          />
        ))}
      </div>
    </div>
  );
}
