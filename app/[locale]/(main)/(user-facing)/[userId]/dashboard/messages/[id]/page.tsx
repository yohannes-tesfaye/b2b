import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { markRead } from "@/utils/inquiries/actions";
import { ChatBubble } from "@/components/inquiries/ChatBubble";
import { DateSeparator } from "@/components/inquiries/DateSeparator";
import { ReplyForm } from "@/components/inquiries/reply-form";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { categoryLabel } from "@/lib/listings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsFrom } from "@/lib/profile";

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
      buyer: { select: { id: true, name: true, companyName: true, image: true } },
      seller: { select: { id: true, name: true, companyName: true, image: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, companyName: true, image: true } } },
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

  await markRead(id);

  const counterpart = isBuyer ? conversation.seller : conversation.buyer;
  const counterpartUnread = isBuyer ? conversation.sellerUnread : conversation.buyerUnread;

  // Group messages by date for separators
  const messagesWithDates: Array<{ type: "date"; date: Date } | { type: "msg"; msg: (typeof conversation.messages)[0] }> = [];
  let lastDate: string | null = null;
  for (const msg of conversation.messages) {
    const msgDate = new Date(msg.createdAt).toDateString();
    if (msgDate !== lastDate) {
      messagesWithDates.push({ type: "date", date: msg.createdAt });
      lastDate = msgDate;
    }
    messagesWithDates.push({ type: "msg", msg });
  }

  // Determine if consecutive messages are from the same sender
  const isGrouped = (index: number) => {
    if (index === 0) return false;
    const prev = messagesWithDates[index - 1];
    const curr = messagesWithDates[index];
    if (prev.type !== "msg" || curr.type !== "msg") return false;
    return prev.msg.senderId === curr.msg.senderId;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Sticky header */}
      <div className="flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Link
          href={`${base}/messages`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar className="h-9 w-9 shrink-0">
          {counterpart.image ? (
            <AvatarImage src={counterpart.image} alt={counterpart.name ?? ""} />
          ) : null}
          <AvatarFallback className="text-xs font-bold">
            {initialsFrom(counterpart.name || counterpart.companyName || "?")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {counterpart.companyName || counterpart.name || "Unknown"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.listing.title}
          </p>
        </div>
      </div>

      {/* Listing context bar */}
      <div className="border-b bg-muted/30 px-4 py-2">
        <Link
          href={`/products/${conversation.listing.id}`}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Package className="h-3.5 w-3.5" />
          <span className="truncate">{conversation.listing.title}</span>
          <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
            {categoryLabel(conversation.listing.category)}
          </span>
        </Link>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messagesWithDates.map((item, index) => {
            if (item.type === "date") {
              return <DateSeparator key={`date-${index}`} date={item.date} />;
            }
            const msg = item.msg;
            const isOwn = msg.senderId === user.id;
            const grouped = isGrouped(index);
            const isRead = isOwn
              ? (isBuyer ? conversation.buyerUnread === 0 : conversation.sellerUnread === 0)
              : false;

            return (
              <ChatBubble
                key={msg.id}
                body={msg.body}
                isOwn={isOwn}
                timestamp={msg.createdAt}
                isRead={isRead}
                showAvatar={!isOwn && !grouped}
                avatarFallback={initialsFrom(msg.sender.name || msg.sender.companyName || "?")}
                isGrouped={grouped}
                attachment={msg.attachment}
              />
            );
          })
        )}
      </div>

      {/* Sticky input */}
      <ReplyForm conversationId={id} />
    </div>
  );
}
