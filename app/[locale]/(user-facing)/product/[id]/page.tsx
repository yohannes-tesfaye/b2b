import { getTranslations } from "next-intl/server";
import { ProductGallery } from "@/components/shared/product/ProductGallery";
import { ProductInfo } from "@/components/shared/product/ProductInfo";
import { SupplierCard } from "@/components/shared/product/SupplierCard";
import { KeySpecifications } from "@/components/shared/product/KeySpecifications";
import { ProductTabs } from "@/components/shared/product/ProductTabs";
import { ContactSection } from "@/components/shared/product/ContactSection";
import { FAQSection } from "@/components/shared/product/FAQSection";
import { Product } from "@/types/product";
import { PRODUCT_DEMO_IMAGES } from "@/lib/product-demo";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("product");

  // TODO: Fetch product by `id` from API; demo copy is localized for now
  void id;

  const product: Product = {
    id,
    title: t("demo.title"),
    images: [...PRODUCT_DEMO_IMAGES],
    priceRange: { min: 4.2, max: 6.8 },
    currency: "USD",
    moq: 300,
    variants: [
      {
        id: "1",
        name: t("demo.variants.grade1"),
        price: 6.8,
        inStock: true,
      },
      {
        id: "2",
        name: t("demo.variants.grade2"),
        price: 5.4,
        inStock: true,
      },
      {
        id: "3",
        name: t("demo.variants.ground"),
        price: 4.2,
        inStock: false,
      },
    ],
    specifications: [
      {
        label: t("demo.specifications.origin.label"),
        value: t("demo.specifications.origin.value"),
      },
      {
        label: t("demo.specifications.variety.label"),
        value: t("demo.specifications.variety.value"),
      },
      {
        label: t("demo.specifications.process.label"),
        value: t("demo.specifications.process.value"),
      },
      {
        label: t("demo.specifications.moisture.label"),
        value: t("demo.specifications.moisture.value"),
      },
      {
        label: t("demo.specifications.packaging.label"),
        value: t("demo.specifications.packaging.value"),
      },
      {
        label: t("demo.specifications.certification.label"),
        value: t("demo.specifications.certification.value"),
      },
    ],
    supplier: {
      id: "1",
      name: t("demo.supplier.name"),
      logo: "☕",
      country: t("demo.supplier.country"),
      countryFlag: "🇪🇹",
      verified: true,
      rating: 4.8,
      responseRate: "98%",
      responseTime: t("demo.supplier.responseTime"),
      joinedDate: t("demo.supplier.joinedDate"),
      badges: [
        t("demo.supplier.badges.gold"),
        t("demo.supplier.badges.assurance"),
      ],
      contactEmail: "sales@highlandharvest.et",
      contactPhone: "+251 911 234 567",
    },
    description: t("demo.description"),
    fullSpecs: [
      {
        label: t("demo.fullSpecs.productName.label"),
        value: t("demo.fullSpecs.productName.value"),
      },
      {
        label: t("demo.fullSpecs.brand.label"),
        value: t("demo.fullSpecs.brand.value"),
      },
      {
        label: t("demo.fullSpecs.model.label"),
        value: t("demo.fullSpecs.model.value"),
      },
      {
        label: t("demo.fullSpecs.grade.label"),
        value: t("demo.fullSpecs.grade.value"),
      },
      {
        label: t("demo.fullSpecs.altitude.label"),
        value: t("demo.fullSpecs.altitude.value"),
      },
      {
        label: t("demo.fullSpecs.screenSize.label"),
        value: t("demo.fullSpecs.screenSize.value"),
      },
      {
        label: t("demo.fullSpecs.cuppingScore.label"),
        value: t("demo.fullSpecs.cuppingScore.value"),
      },
      {
        label: t("demo.fullSpecs.packaging.label"),
        value: t("demo.fullSpecs.packaging.value"),
      },
      {
        label: t("demo.fullSpecs.shelfLife.label"),
        value: t("demo.fullSpecs.shelfLife.value"),
      },
      {
        label: t("demo.fullSpecs.certification.label"),
        value: t("demo.fullSpecs.certification.value"),
      },
      {
        label: t("demo.fullSpecs.origin.label"),
        value: t("demo.fullSpecs.origin.value"),
      },
      {
        label: t("demo.fullSpecs.moq.label"),
        value: t("demo.fullSpecs.moq.value"),
      },
      {
        label: t("demo.fullSpecs.supplyAbility.label"),
        value: t("demo.fullSpecs.supplyAbility.value"),
      },
    ],
    advantages: [
      t("demo.advantages.a1"),
      t("demo.advantages.a2"),
      t("demo.advantages.a3"),
      t("demo.advantages.a4"),
      t("demo.advantages.a5"),
      t("demo.advantages.a6"),
    ],
    faqs: [
      {
        question: t("demo.faqs.q1.question"),
        answer: t("demo.faqs.q1.answer"),
      },
      {
        question: t("demo.faqs.q2.question"),
        answer: t("demo.faqs.q2.answer"),
      },
      {
        question: t("demo.faqs.q3.question"),
        answer: t("demo.faqs.q3.answer"),
      },
      {
        question: t("demo.faqs.q4.question"),
        answer: t("demo.faqs.q4.answer"),
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProductGallery images={product.images} title={product.title} />
        </div>
        <div className="lg:col-span-1">
          <ProductInfo product={product} />
        </div>
        <div className="lg:col-span-1">
          <SupplierCard supplier={product.supplier} />
        </div>
      </div>

      <KeySpecifications specifications={product.specifications} />

      <ProductTabs
        description={product.description}
        fullSpecs={product.fullSpecs}
        advantages={product.advantages}
      />

      <ContactSection />

      <FAQSection faqs={product.faqs} />
    </div>
  );
}
