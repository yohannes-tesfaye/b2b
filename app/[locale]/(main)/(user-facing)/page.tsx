import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
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

  const t = await getTranslations("home.latest");

  return (
    <div>
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier />
        {listings.length ? (
          <section className="container-wide mt-12">
            <header className="mb-8 text-center">
              <p className="type-caption text-brand">{t("eyebrow")}</p>
              <h2 className="type-section mt-2">{t("title")}</h2>
              <p className="type-body mt-3 text-muted-foreground">
                {t("description")}
              </p>
            </header>
            <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {listings.map((listing) => (
                <ProductListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
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
