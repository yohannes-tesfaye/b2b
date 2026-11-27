"use client";

import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/lib/auth-client";

/**
 * Primary header CTA: opens the listing form when signed in, otherwise sign-up.
 */
export function SellButton({
  className,
  fullWidth = false,
  onNavigate,
}: {
  className?: string;
  fullWidth?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("header");
  const { data: session } = useSession();
  const href = session
    ? "/dashboard/listings/new"
    : "/sign-up";

  return (
    <Button
      className={cn(
        "h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/85",
        fullWidth && "h-12 w-full",
        className
      )}
      render={<Link href={href} onClick={onNavigate} />}
      nativeButton={false}
    >
      <PlusCircle className="size-4" strokeWidth={1.75} />
      {t("postListing")}
    </Button>
  );
}
