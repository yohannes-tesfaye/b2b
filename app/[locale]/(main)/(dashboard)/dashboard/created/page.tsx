import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/dashboard-access";

export default async function CreatedListingsPage() {
  await requireAdmin();
  redirect({ href: "/listings", locale: await getLocale() });
}
