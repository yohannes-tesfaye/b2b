import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAdmin } from "@/lib/dashboard-access";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullUser = await requireAdmin();

  const user = {
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
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
