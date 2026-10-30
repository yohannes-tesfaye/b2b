import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { adminRoles } from "@/lib/permissions";
import { parseRoles } from "@/lib/profile";

/**
 * Ensures the signed-in user is the owner of the dashboard in the URL. A
 * mismatched id redirects to the signed-in user's own dashboard instead of
 * exposing someone else's listings.
 */
export async function requireOwnDashboard(userId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect({ href: "/log-in", locale: await getLocale() });
  }

  if (user.id !== userId) {
    return redirect({
      href: userDashboardPath(user.id),
      locale: await getLocale(),
    });
  }

  return user;
}

/** Ensures the signed-in user has an admin or superadmin role. */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect({ href: "/log-in", locale: await getLocale() });
  }

  const roles = parseRoles(user.role);
  if (!roles.some((role) => adminRoles.includes(role))) {
    return redirect({
      href: userDashboardPath(user.id),
      locale: await getLocale(),
    });
  }

  return user;
}
