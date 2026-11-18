"use client";
import { useTranslations } from "next-intl";
import HeroSection from "@/components/Landing/Hero";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import Reviews from "@/components/shared/Reviews";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";
import { ProductListingCard } from "@/components/product/product-listing-card";
import { HOME_PLACEHOLDER_LISTINGS } from "@/components/shared/home-listings";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier />
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {HOME_PLACEHOLDER_LISTINGS.map((listing) => (
              <ProductListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
        <SuppliersByRegion />
        <ProductSectionWanted />
      </div>
      <TrustedBy />
      <Reviews />
    </div>
  );
};

export default Home;
