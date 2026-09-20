import HeroSection from "@/components/Landing/Hero";
import Header from "@/components/shared/Header";
import { ProductCard } from "@/components/shared/ProductCard";
import ProductSectionSupplier from "@/components/shared/ProductSectionSupplier";
import ProductSectionWanted from "@/components/shared/ProductSectionWanted";
import TopHeader from "@/components/shared/TopHeader";

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
        <ProductSectionWanted />
        <div className="w-[95%] mx-auto flex flex-wrap gap-5 justify-center sm:justify-start">
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
          <ProductCard type="supplier" />
        </div>
      </div>
    </div>
  );
};

export default Home;
