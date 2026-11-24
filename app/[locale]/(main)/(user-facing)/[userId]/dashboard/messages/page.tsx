import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { MessagesPageClient } from "@/components/inquiries/MessagesPageClient";

type SearchParams = Promise<{ filter?: string }>;

export default async function MessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: SearchParams;
}) {
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const base = userDashboardPath(user.id);

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, category: true } },
      buyer: { select: { id: true, name: true, companyName: true, image: true } },
      seller: { select: { id: true, name: true, companyName: true, image: true } },
    },
  });

  return (
    <MessagesPageClient
      conversations={JSON.parse(JSON.stringify(conversations))}
      userId={user.id}
      base={base}
      initialFilter={filter}
    />
  );
}
