"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Supplier } from "@/types/product";

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const t = useTranslations("product");

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
          {supplier.logo}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{supplier.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{supplier.countryFlag}</span>
            <span>{supplier.country}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {supplier.badges.map((badge, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {badge}
          </Badge>
        ))}
        {supplier.verified && (
          <Badge className="bg-green-600 text-white text-xs">
            {t("verified")}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-gray-500">{t("responseRate")}</p>
          <p className="font-semibold text-gray-900">{supplier.responseRate}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("responseTime")}</p>
          <p className="font-semibold text-gray-900">{supplier.responseTime}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(supplier.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {supplier.rating.toFixed(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div>
          <p className="text-gray-500">{t("email")}</p>
          <a
            href={`mailto:${supplier.contactEmail}`}
            className="text-gray-900 hover:underline"
          >
            {supplier.contactEmail}
          </a>
        </div>
        <div>
          <p className="text-gray-500">{t("phone")}</p>
          <a
            href={`tel:${supplier.contactPhone.replace(/\s/g, "")}`}
            className="text-gray-900 hover:underline"
          >
            {supplier.contactPhone}
          </a>
        </div>
      </div>

      <Button
        render={<Link href="/contact" />}
        nativeButton={false}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {t("contactSupplier")}
      </Button>
    </Card>
  );
}
