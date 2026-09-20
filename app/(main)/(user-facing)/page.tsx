import HeroSection from "@/components/Landing/Hero";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { ProductCard } from "@/components/shared/ProductCard";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import Reviews from "@/components/shared/Reviews";
import TopHeader from "@/components/shared/TopHeader";
import SuppliersByRegion from "@/components/shared/SuppliersByRegion";
import TrustedBy from "@/components/shared/TrustedBy";

const Home = () => {
  return (
    <div>
      <TopHeader />
      <Header />
      <HeroSection />
      <div className="space-y-10">
        <ProductSectionSupplier />
        <div className="w-[95%] mx-auto flex flex-wrap gap-5 justify-center sm:justify-start">
          <ProductCard type="wanted" />
          <ProductCard type="wanted" />
          <ProductCard type="wanted" />
          <ProductCard type="wanted" />
        </div>
        <SuppliersByRegion />
        <ProductSectionWanted />
        <div className="w-[95%] mx-auto flex flex-wrap gap-5 justify-center sm:justify-start">
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
        </div>
      </div>
      <TrustedBy />
      <Reviews />

      <Footer />
    </div>
  );
};

export default Home;
