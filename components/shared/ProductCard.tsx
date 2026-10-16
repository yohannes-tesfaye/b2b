"use client";
import { Star, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id?: string;
  type?: "supplier" | "wanted";
  title?: string;
  rating?: number;
  country?: string;
  countryFlag?: string;
  imageUrl?: string;
  verified?: boolean;
}

export function ProductCard({
  id = "9",
  type = "wanted",
  title,
  rating = 4.5,
  country,
  countryFlag = "https://flagcdn.com/w40/et.png",
  imageUrl = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&auto=format&fit=crop&q=80",
  verified = true,
}: ProductCardProps) {
  const t = useTranslations("product");
  const resolvedTitle = title ?? t("demo.title");
  const resolvedCountry = country ?? t("demo.supplier.country");

  return (
    <Link href={`/product/${id}`}>
      <Card className="group flex flex-1 min-w-[260px] max-w-sm flex-col overflow-hidden transition-all duration-200 hover:shadow-md border-border bg-card cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between p-3.5 pb-2 space-y-0">
          <Badge
            variant={type === "wanted" ? "default" : "secondary"}
            className={`capitalize font-semibold text-xs ${
              type === "wanted"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {type === "wanted" ? t("wantedHighlight") : t("supplierHighlight")}
          </Badge>
        </CardHeader>

        <CardContent className="p-3.5 pt-0 flex-1 flex flex-col justify-between">
          <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted mb-3">
              <img
                src={imageUrl}
                alt={resolvedTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {verified && (
                <Badge className="absolute bottom-2 left-2 bg-emerald-600/95 hover:bg-emerald-600 text-white backdrop-blur-sm text-[10px] px-2 py-0.5 gap-1 font-semibold border-none">
                  <CheckCircle2 className="w-3 h-3" /> {t("verified")}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < rating
                          ? "fill-amber-400/50 text-amber-400"
                          : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {rating.toFixed(1)}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug hover:underline cursor-pointer mb-2">
              {resolvedTitle}
            </h3>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <img
                src={countryFlag}
                alt={resolvedCountry}
                className="h-4 w-4 object-cover rounded-sm"
              />
              <span className="font-medium">{resolvedCountry}</span>
            </div>

            {verified && (
              <Badge className="bg-emerald-600/95 hover:bg-emerald-600 text-white backdrop-blur-sm text-[10px] px-2 py-0.5 gap-1 font-semibold border-none">
                <CheckCircle2 className="w-3 h-3" /> {t("verified")}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3.5 pt-0">
          <span className="inline-flex w-full h-9 items-center justify-center rounded-lg bg-blue-600 text-white font-medium text-sm">
            {t("contact")}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
