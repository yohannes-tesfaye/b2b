"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, Variant } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations("product");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] || null,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {product.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {product.currency} {product.priceRange.min.toFixed(2)} –{" "}
            {product.priceRange.max.toFixed(2)}
            <span className="text-sm font-medium text-gray-500 ml-1">/ kg</span>
          </span>
          <Badge variant="outline" className="text-sm">
            {t("moq", { count: product.moq })}
          </Badge>
        </div>
      </div>

      {product.variants.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("variants")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={
                  selectedVariant?.id === variant.id ? "default" : "outline"
                }
                onClick={() => setSelectedVariant(variant)}
                disabled={!variant.inStock}
                className="text-sm"
              >
                {variant.name}
                {!variant.inStock && ` ${t("outOfStock")}`}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          render={<Link href="/contact" />}
          nativeButton={false}
          size="lg"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {t("contactSupplier")}
        </Button>
        <Button
          render={<Link href="/contact" />}
          nativeButton={false}
          size="lg"
          variant="outline"
          className="flex-1"
        >
          {t("requestQuote")}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          {t("addToFavorites")}
        </Button>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          {t("compare")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              void navigator.share({
                title: product.title,
                url: window.location.href,
              });
            } else if (typeof navigator !== "undefined") {
              void navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          {t("share")}
        </Button>
      </div>
    </div>
  );
}

