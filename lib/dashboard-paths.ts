/**
 * Client-safe dashboard path helpers. Keep server-only access checks in
 * `lib/dashboard-access.ts` so components can import these without pulling in
 * database or request headers.
 */

/**
 * Base path for the signed-in user's dashboard. Every user shares one
 * dashboard and the user is resolved from the session, so the id argument is
 * kept only for backwards compatibility with older call sites.
 */
export function userDashboardPath(_userId?: string) {
  return "/dashboard";
}

/**
 * Where to send a user after signing in or finishing onboarding. There is a
 * single dashboard for buyers, suppliers and admins; moderation lives under
 * `/admin` and is linked from the sidebar.
 */
export function dashboardLandingPath(_user?: {
  id: string;
  role?: string | null;
}) {
  return "/dashboard";
}
