import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dashboard-access";
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const t = await getTranslations("inbox");
  const base = "/dashboard";

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          category: true,
          type: true,
          quantity: true,
          images: true,
        },
      },
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
        <p className="font-semibold">{t("thread.notFound")}</p>
        <Link href={`${base}/messages`} className="text-sm text-primary">
          {t("thread.backToInbox")}
        </Link>
      </div>
    );
  }

  const isBuyer = conversation.buyerId === user.id;
  const isSeller = conversation.sellerId === user.id;
  if (!isBuyer && !isSeller) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
        <p className="font-semibold">{t("thread.notAuthorized")}</p>
      </div>
    );
  }

  await markRead(id);

  const counterpart = isBuyer ? conversation.seller : conversation.buyer;

  // The listing this whole thread is about; shown as a reply preview on messages.
  const listingRef = {
    id: conversation.listing.id,
    title: conversation.listing.title,
    image: conversation.listing.images?.[0] ?? null,
    meta:
      [categoryLabel(conversation.listing.category), conversation.listing.quantity]
        .filter(Boolean)
        .join(" · ") || null,
  };

  // Group messages by date for separators
  const messagesWithDates: Array<
    { type: "date"; date: Date } | { type: "msg"; msg: (typeof conversation.messages)[0] }
  > = [];
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
    <div className="flex h-[calc(100dvh-10rem)] flex-col md:h-[calc(100dvh-8rem)]">
      {/* Sticky header */}
      <div className="flex items-center gap-3 border-b bg-background/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4 sm:py-3">
        <Link
          href={`${base}/messages`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={t("thread.backToInbox")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Link href={`/profile/${counterpart.id}`} className="shrink-0">
          <Avatar className="h-11 w-11">
            {counterpart.image ? (
              <AvatarImage src={counterpart.image} alt={counterpart.name ?? ""} />
            ) : null}
            <AvatarFallback className="text-xs font-bold">
              {initialsFrom(counterpart.name || counterpart.companyName || "?")}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${counterpart.id}`} className="block">
            <p className="truncate text-sm font-semibold hover:underline">
              {counterpart.companyName || counterpart.name || "Unknown"}
            </p>
          </Link>
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
              {t("thread.noMessagesYet")}
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
              ? isBuyer
                ? conversation.buyerUnread === 0
                : conversation.sellerUnread === 0
              : false;

            return (
              <ChatBubble
                key={msg.id}
                body={msg.body}
                isOwn={isOwn}
                timestamp={msg.createdAt}
                isRead={isRead}
                showAvatar={!isOwn && !grouped}
                avatarFallback={initialsFrom(
                  msg.sender.name || msg.sender.companyName || "?"
                )}
                isGrouped={grouped}
                attachment={msg.attachment}
                senderId={msg.senderId}
                listing={msg.viaListing ? listingRef : null}
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
