import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/Landing/Hero";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import Reviews from "@/components/shared/Reviews";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";
import { ProductListingCard } from "@/components/product/product-listing-card";

const activeWhere: Prisma.ListingWhereInput = {
  status: "active",
  OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
};

export default async function Home() {
  const [available, wanted] = await Promise.all([
    prisma.listing.findMany({
      where: { ...activeWhere, type: "available" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.listing.findMany({
      where: { ...activeWhere, type: "wanted" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const supplierListings = available.slice(0, 4);
  const moreListings = available.slice(4, 8);

  return (
    <div>
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier listings={supplierListings} />
        {moreListings.length ? (
          <div className="w-full px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {moreListings.map((listing) => (
                <ProductListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        ) : null}
        <SuppliersByRegion />
        <ProductSectionWanted listings={wanted} />
      </div>
      <TrustedBy />
      <Reviews />
    </div>
  );
}
