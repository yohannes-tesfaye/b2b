"use client";
import { useTranslations } from "next-intl";
import { Specification } from "@/types/product";

interface KeySpecificationsProps {
  specifications: Specification[];
}

export function KeySpecifications({ specifications }: KeySpecificationsProps) {
  const t = useTranslations("product");

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {t("keySpecifications")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specifications.map((spec, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-gray-500">{spec.label}</p>
            <p className="text-sm font-medium text-gray-900">{spec.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
