import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const banned = (session?.user as { banned?: boolean | null } | undefined)?.banned ?? false;
  if (session && banned) {
    redirect({ href: "/log-in?banned=1", locale: await getLocale() });
  }
  const user = session?.user
    ? {
        name: session.user.name ?? session.user.email ?? "User",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        role: (session.user as { role?: string | null }).role ?? null,
      }
    : { name: "Guest", email: "", image: null, role: null };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
