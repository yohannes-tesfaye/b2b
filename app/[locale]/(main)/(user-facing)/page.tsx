import HeroSection from "@/components/Landing/Hero";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import LatestListings from "@/components/shared/LatestListings";
import Reviews from "@/components/shared/Reviews";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";

export const dynamic = "force-dynamic";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ProductSectionSupplier />
      <LatestListings />
      <SuppliersByRegion />
      <ProductSectionWanted />
      <TrustedBy />
      <Reviews />
    </div>
  );
};

export default Home;
