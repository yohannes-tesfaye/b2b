import { Link } from "@/i18n/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { formatListingDate, categoryLabel } from "@/lib/listings";
import { markRead, sendMessage } from "@/utils/inquiries/actions";
import { ReplyForm } from "@/components/inquiries/reply-form";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ userId: string; id: string }>;
}) {
  const { userId, id } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, category: true, type: true } },
      buyer: { select: { id: true, name: true, companyName: true, email: true } },
      seller: { select: { id: true, name: true, companyName: true, email: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, companyName: true } } },
      },
    },
  });

  if (!conversation) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
        <p className="font-semibold">Conversation not found</p>
        <Link href={`${base}/messages`} className="text-sm text-primary">
          Back to inbox
        </Link>
      </div>
    );
  }

  const isBuyer = conversation.buyerId === user.id;
  const isSeller = conversation.sellerId === user.id;
  if (!isBuyer && !isSeller) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
        <p className="font-semibold">Not authorized</p>
      </div>
    );
  }

  // Mark as read on open.
  await markRead(id);

  const counterpart = isBuyer ? conversation.seller : conversation.buyer;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`${base}/messages`}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Inbox
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold">{conversation.subject}</h2>
          <p className="truncate text-sm text-muted-foreground">
            with {counterpart.companyName || counterpart.name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Listing context */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${conversation.listing.id}`}
              className="font-semibold hover:underline"
            >
              {conversation.listing.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {categoryLabel(conversation.listing.category)} ·{" "}
              {conversation.listing.type === "wanted" ? "Wanted" : "Available"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
        {conversation.messages.map((message) => {
          const isOwn = message.senderId === user.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatListingDate(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      <ReplyForm conversationId={id} />
    </div>
  );
}
