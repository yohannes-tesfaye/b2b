import { adminRoles } from "@/lib/permissions";
import { parseRoles } from "@/lib/profile";

/**
 * Client-safe dashboard path helpers. Keep server-only access checks in
 * `lib/dashboard-access.ts` so components can import these without pulling in
 * database or request headers.
 */

/** Base path for a user's personal dashboard. */
export function userDashboardPath(userId: string) {
  return `/${userId}/dashboard`;
}

/**
 * Where to send a user after signing in or finishing onboarding. Admins keep
 * the platform dashboard; everyone else lands on their personal dashboard.
 */
export function dashboardLandingPath(user: {
  id: string;
  role?: string | null;
}) {
  const roles = parseRoles(user.role);
  if (roles.some((role) => adminRoles.includes(role))) {
    return "/dashboard";
  }
  return userDashboardPath(user.id);
}
