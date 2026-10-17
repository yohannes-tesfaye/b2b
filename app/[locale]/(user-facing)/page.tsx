"use client";
import { useTranslations } from "next-intl";
import HeroSection from "@/components/Landing/Hero";
import { ProductCard } from "@/components/shared/ProductCard";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import Reviews from "@/components/shared/Reviews";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";
import {
  PRODUCT_CARD_FLAGS,
  PRODUCT_CARD_IMAGES,
} from "@/lib/product-demo";

const Home = () => {
  const t = useTranslations("product");

  const wantedIds = ["1", "2", "3", "4"] as const;
  const supplierIds = ["5", "6", "7", "8"] as const;

  return (
    <div>
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier />
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {wantedIds.map((id) => (
              <ProductCard
                key={id}
                id={id}
                type="wanted"
                title={t(`cards.${id}.title`)}
                country={t(`cards.${id}.country`)}
                countryFlag={PRODUCT_CARD_FLAGS[id]}
                imageUrl={PRODUCT_CARD_IMAGES[id]}
              />
            ))}
          </div>
        </div>
        <SuppliersByRegion />
        <ProductSectionWanted />
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {supplierIds.map((id) => (
              <ProductCard
                key={id}
                id={id}
                type="supplier"
                title={t(`cards.${id}.title`)}
                country={t(`cards.${id}.country`)}
                countryFlag={PRODUCT_CARD_FLAGS[id]}
                imageUrl={PRODUCT_CARD_IMAGES[id]}
              />
            ))}
          </div>
        </div>
      </div>
      <TrustedBy />
      <Reviews />
    </div>
  );
};

export default Home;
