import { Star, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  type?: "supplier" | "wanted";
  title?: string;
  rating?: number;
  country?: string;
  countryFlag?: string;
  imageUrl?: string;
  verified?: boolean;
}

export function ProductCard({
  type = "wanted",
  title = "Ceeport Medical Xeroform Petrolatum Dressing",
  rating = 3.5,
  country = "China",
  countryFlag = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
  imageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
  verified = true,
}: ProductCardProps) {
  return (
    <Card className="group flex flex-1 min-w-[260px] max-w-sm flex-col overflow-hidden transition-all duration-200 hover:shadow-md border-border bg-card">
      {/* Top Section: Tag & Favorite */}
      <CardHeader className="flex flex-row items-center justify-between p-3.5 pb-2 space-y-0">
        <Badge
          variant={type === "wanted" ? "default" : "secondary"}
          className={`capitalize font-semibold text-xs ${
            type === "wanted"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {type}
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 pt-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {verified && (
              <Badge className="absolute bottom-2 left-2 bg-emerald-600/95 hover:bg-emerald-600 text-white backdrop-blur-sm text-[10px] px-2 py-0.5 gap-1 font-semibold border-none">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </Badge>
            )}
          </div>

          {/* Rating */}
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

          {/* Title */}
          <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug hover:underline cursor-pointer mb-2">
            {title}
          </h3>
        </div>

        {/* Country */}
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <span className="text-base leading-none">
              {" "}
              <img
                src={countryFlag}
                alt={country}
                className="h-4 w-4 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="font-medium">{country}</span>
          </div>

          {verified && (
            <Badge className=" bg-emerald-600/95 hover:bg-emerald-600 text-white backdrop-blur-sm text-[10px] px-2 py-0.5 gap-1 font-semibold border-none">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="p-3.5 pt-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm h-9">
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
