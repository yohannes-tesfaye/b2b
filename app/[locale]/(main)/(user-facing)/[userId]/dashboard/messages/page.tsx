import { Link } from "@/i18n/navigation";
import { Inbox, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { formatListingDate } from "@/lib/listings";
import { markRead } from "@/utils/inquiries/actions";

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
      buyer: { select: { id: true, name: true, companyName: true } },
      seller: { select: { id: true, name: true, companyName: true } },
    },
  });

  const filtered = conversations.filter((conversation) => {
    const isBuyer = conversation.buyerId === user.id;
    const unread = isBuyer ? conversation.buyerUnread : conversation.sellerUnread;
    if (filter === "unread") return unread > 0;
    if (filter === "buying") return isBuyer;
    if (filter === "selling") return !isBuyer;
    return true;
  });

  const unreadTotal = conversations.reduce(
    (total, conversation) =>
      total +
      (conversation.buyerId === user.id
        ? conversation.buyerUnread
        : conversation.sellerUnread),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-sm text-muted-foreground">
            Inquiries and conversations with traders.
          </p>
        </div>
        {unreadTotal > 0 ? (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {unreadTotal} unread
          </span>
        ) : null}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-muted/30 p-1">
        {[
          { value: "all", label: "All" },
          { value: "unread", label: "Unread" },
          { value: "buying", label: "Buying" },
          { value: "selling", label: "Selling" },
        ].map((tab) => {
          const active = filter === tab.value;
          return (
            <Link
              key={tab.value}
              href={`${base}/messages${tab.value === "all" ? "" : `?filter=${tab.value}`}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {filtered.length ? (
        <div className="space-y-2">
          {filtered.map((conversation) => {
            const isBuyer = conversation.buyerId === user.id;
            const unread = isBuyer
              ? conversation.buyerUnread
              : conversation.sellerUnread;
            const counterpart = isBuyer ? conversation.seller : conversation.buyer;

            return (
              <Link
                key={conversation.id}
                href={`${base}/messages/${conversation.id}`}
                className={`block rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 ${
                  unread ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {counterpart.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">
                        {counterpart.companyName || counterpart.name || "Unknown"}
                      </p>
                      {unread ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                          {unread} new
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.subject}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {conversation.lastMessagePreview}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    <p>{formatListingDate(conversation.lastMessageAt)}</p>
                    <p className="mt-1 inline-flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {conversation.listing.title.slice(0, 20)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Inquiries you send or receive will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
