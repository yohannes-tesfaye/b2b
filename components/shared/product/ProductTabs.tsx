"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Specification } from "@/types/product";

interface ProductTabsProps {
  description: string;
  fullSpecs: Specification[];
  advantages: string[];
}

export function ProductTabs({
  description,
  fullSpecs,
  advantages,
}: ProductTabsProps) {
  const t = useTranslations("product");
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "description"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-300"
          }`}
        >
          {t("description")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "specs"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-300"
          }`}
        >
          {t("fullSpecifications")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("advantages")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "advantages"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-300"
          }`}
        >
          {t("advantages")}
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "description" && (
          <div className="text-gray-700 dark:text-gray-300">
            <p>{description}</p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-500">{spec.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "advantages" && (
          <ul className="space-y-3">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{advantage}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

