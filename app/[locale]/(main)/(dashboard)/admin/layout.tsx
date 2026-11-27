import { requireAdmin } from "@/lib/dashboard-access";

/**
 * Moderation lives under `/admin`. `requireAdmin()` is intentionally left in
 * its current (development) state by the team, but keeping the call here means
 * re-enabling the role gate in one place protects every admin page.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
