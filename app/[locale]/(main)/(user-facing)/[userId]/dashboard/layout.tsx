import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { requireOwnDashboard } from "@/lib/dashboard-access";

export default async function UserDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <DashboardNav userId={user.id} />
      {children}
    </div>
  );
}
