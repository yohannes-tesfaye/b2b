"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Favorites entry point that works both on desktop and mobile. Routes
 * signed-in users to their favorites and signed-out users to log in with a
 * `next` param, so it can be placed wherever the header needs it.
 */
export function FavoritesLink({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const t = useTranslations("header");
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Skeleton
        className={cn("rounded-full", className ?? "h-9 w-9")}
        aria-hidden="true"
      />
    );
  }

  const href = session
    ? "/dashboard/favorites"
    : "/log-in?next=%2Fdashboard%2Ffavorites";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-red-500",
        className
      )}
      aria-label={t("favourites")}
    >
      <Heart className={cn("h-5 w-5", iconClassName)} />
    </Link>
  );
}
