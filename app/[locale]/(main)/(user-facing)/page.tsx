import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/Landing/Hero";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import Reviews from "@/components/shared/Reviews";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";
import { ProductListingCard } from "@/components/product/product-listing-card";

export const dynamic = "force-dynamic";

const Home = async () => {
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier />
        {listings.length ? (
          <div className="w-full px-4">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {listings.map((listing) => (
                <ProductListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        ) : null}
        <SuppliersByRegion />
        <ProductSectionWanted />
      </div>
      <TrustedBy />
      <Reviews />
    </div>
  );
};

export default Home;
