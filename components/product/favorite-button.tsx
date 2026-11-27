"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/utils/favorites/actions";
import { toast } from "sonner";

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  size = "sm",
  showLabel = false,
}: {
  listingId: string;
  initialFavorited?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        const result = await toggleFavorite(listingId);
        setIsFavorited(result.isFavorited);
        toast.success(
          result.isFavorited ? "Added to favorites" : "Removed from favorites"
        );
      } catch {
        toast.error("Please sign in to save favorites");
      }
    });
  };

  return (
    <Button
      variant={showLabel ? "outline" : "ghost"}
      size={showLabel ? "default" : size === "sm" ? "icon" : size === "md" ? "icon-lg" : "icon-lg"}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={
        showLabel
          ? `mt-3 h-11 w-full rounded-xl text-sm font-semibold ${
              isFavorited ? "border-red-500 text-red-500" : ""
            }`
          : `h-11 w-11 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 sm:h-8 sm:w-8 ${
              isFavorited ? "text-red-500" : "text-white"
            }`
      }
    >
      <Heart
        className={`${showLabel ? "h-4 w-4 mr-2" : "h-4 w-4"} ${
          isFavorited ? "fill-red-500" : ""
        }`}
      />
      {showLabel ? (isFavorited ? "Saved to favorites" : "Save to favorites") : null}
    </Button>
  );
}
