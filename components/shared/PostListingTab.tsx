"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "cn";

/**
 * Raised center action in the mobile bottom bar. Routes signed-in users to
 * the listing form and everyone else to sign up, matching the header CTA.
 */
export function PostListingTab() {
  const t = useTranslations("header");
  const { data: session } = useSession();
  const pathname = usePathname() || "";
  const href = session ? "/dashboard/listings/new" : "/sign-up";
  const active =
    pathname === "/dashboard/listings/new" ||
    pathname.startsWith("/dashboard/listings/new/");

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={t("postListing")}
      className="relative flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors"
    >
      <span
        className={cn(
          "flex size-12 -translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform",
          active && "scale-105 shadow-primary/40"
        )}
      >
        <Plus className="size-[22px]" strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          "truncate px-1",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        {t("bottomNav.post")}
      </span>
      {active ? (
        <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
      ) : null}
    </Link>
  );
}
