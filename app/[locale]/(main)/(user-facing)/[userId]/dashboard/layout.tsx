import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export default async function UserDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);

  const unreadCount = await prisma.conversation
    .findMany({
      where: {
        OR: [{ buyerId: user.id }, { sellerId: user.id }],
      },
      select: { buyerId: true, sellerId: true, buyerUnread: true, sellerUnread: true },
    })
    .then((conversations) => {
      let total = 0;
      for (const conv of conversations) {
        if (conv.buyerId === user.id) total += conv.buyerUnread;
        if (conv.sellerId === user.id) total += conv.sellerUnread;
      }
      return total;
    });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <DashboardNav userId={user.id} unreadCount={unreadCount} />
      {children}
    </div>
  );
}
