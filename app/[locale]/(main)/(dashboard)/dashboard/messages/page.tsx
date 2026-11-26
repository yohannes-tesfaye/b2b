import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dashboard-access";
import { MessagesPageClient } from "@/components/inquiries/MessagesPageClient";

type SearchParams = Promise<{ filter?: string }>;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const base = "/dashboard";

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
