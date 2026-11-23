import { CategoryMenu } from "./hero/CategoryMenu";
import { HeroBanner } from "./hero/HeroBanner";
import { HowItWorks } from "./hero/HowItWorks";
import { PromoCard } from "./hero/PromoCard";

/**
 * Homepage hero: category rail, editorial banner, wholesale promo and the
 * three-step how-it-works strip.
 */
export default function HeroSection() {
  return (
    <section className="container-wide pt-6 lg:pt-8">
      <div className="grid gap-4 [&>*]:min-w-0 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_16rem]">
        <CategoryMenu />
        <HeroBanner />
        <PromoCard className="min-w-0 lg:col-span-2 xl:col-span-1" />
      </div>

      <HowItWorks />
    </section>
  );
}
