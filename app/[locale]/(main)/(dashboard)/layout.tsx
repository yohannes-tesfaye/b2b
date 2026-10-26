import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const fullUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  const user = fullUser
    ? {
        name: fullUser.name ?? fullUser.email ?? "User",
        email: fullUser.email ?? "",
        image: fullUser.image ?? null,
        role: fullUser.role ?? null,
        companyName: fullUser.companyName ?? null,
        country: fullUser.country ?? null,
        industry: fullUser.industry ?? null,
        companySize: fullUser.companySize ?? null,
        phone: fullUser.phone ?? null,
        website: fullUser.website ?? null,
        emailVerified: fullUser.emailVerified ?? null,
        banned: fullUser.banned ?? null,
        banReason: fullUser.banReason ?? null,
        createdAt: fullUser.createdAt,
      }
    : { name: "Guest", email: "", image: null, role: null };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
