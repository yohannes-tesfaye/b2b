import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { requireOwnDashboard } from "@/lib/dashboard-access";

/**
 * Old `/{userId}/dashboard/...` links still work: verify the signed-in user
 * owns the dashboard in the URL, then forward to the single `/dashboard` tree.
 */
export default async function LegacyUserDashboardRedirect({
  params,
}: {
  params: Promise<{ userId: string; rest?: string[] }>;
}) {
  const { userId, rest = [] } = await params;
  await requireOwnDashboard(userId);

  const [first, ...tail] = rest;
  const tailPath = tail.length ? `/${tail.join("/")}` : "";

  let href = "/dashboard";
  if (first === "favorite") {
    href = `/dashboard/favorites${tailPath}`;
  } else if (first) {
    href = `/dashboard/${[first, ...tail].join("/")}`;
  }

  redirect({ href, locale: await getLocale() });
}
