import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullUser = await requireUser();

  const [pendingListings, conversations] = await Promise.all([
    prisma.listing.count({ where: { status: "pending" } }),
    prisma.conversation.findMany({
      where: { OR: [{ buyerId: fullUser.id }, { sellerId: fullUser.id }] },
      select: {
        buyerId: true,
        sellerId: true,
        buyerUnread: true,
        sellerUnread: true,
      },
    }),
  ]);

  const unreadCount = conversations.reduce((total, conversation) => {
    if (conversation.buyerId === fullUser.id) total += conversation.buyerUnread;
    if (conversation.sellerId === fullUser.id) total += conversation.sellerUnread;
    return total;
  }, 0);

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

  return (
    <DashboardShell
      user={user}
      pendingListings={pendingListings}
      unreadCount={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
