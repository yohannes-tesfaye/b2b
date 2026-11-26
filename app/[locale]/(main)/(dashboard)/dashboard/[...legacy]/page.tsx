import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/**
 * Backwards-compatible redirects for the old dashboard URLs (listings moved to
 * `/dashboard/listings`, moderation moved to `/admin/*`).
 */
export default async function LegacyDashboardRedirect({
  params,
}: {
  params: Promise<{ legacy?: string[] }>;
}) {
  const { legacy = [] } = await params;
  const [first, second] = legacy;
  const locale = await getLocale();

  if (first === "created") {
    redirect({ href: "/admin/listings", locale });
  }
  if (first === "listing") {
    const href = second ? `/admin/listings/${second}` : "/admin/listings";
    redirect({ href, locale });
  }
  if (first === "user") {
    const href = second ? `/admin/users/${second}` : "/admin/users";
    redirect({ href, locale });
  }
  if (first === "categories") {
    redirect({ href: "/admin/categories", locale });
  }

  const tail = legacy.length ? `/${legacy.join("/")}` : "";
  const href = `/dashboard${tail}`;
  redirect({ href, locale });
}
