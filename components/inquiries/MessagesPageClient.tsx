"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Inbox } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";

interface ConversationItem {
  id: string;
  subject: string;
  lastMessagePreview: string;
  lastMessageAt: Date | string;
  buyerId: string;
  sellerId: string;
  buyerUnread: number;
  sellerUnread: number;
  listing: { id: string; title: string; category: string };
  buyer: { id: string; name: string | null; companyName: string | null; image: string | null };
  seller: { id: string; name: string | null; companyName: string | null; image: string | null };
}

interface MessagesPageClientProps {
  conversations: ConversationItem[];
  userId: string;
  base: string;
  initialFilter: string;
}

export function MessagesPageClient({
  conversations,
  userId,
  base,
  initialFilter,
}: MessagesPageClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);

  const filtered = conversations.filter((conv) => {
    const isBuyer = conv.buyerId === userId;
    const unread = isBuyer ? conv.buyerUnread : conv.sellerUnread;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const counterpart = isBuyer ? conv.seller : conv.buyer;
      const name = (counterpart.companyName || counterpart.name || "").toLowerCase();
      const title = conv.listing.title.toLowerCase();
      if (!name.includes(q) && !title.includes(q) && !conv.subject.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Tab filter
    if (filter === "unread") return unread > 0;
    if (filter === "buying") return isBuyer;
    if (filter === "selling") return !isBuyer;
    return true;
  });

  const unreadTotal = conversations.reduce((total, conv) => {
    return total + (conv.buyerId === userId ? conv.buyerUnread : conv.sellerUnread);
  }, 0);

  const relativeTime = (date: Date | string) => {
    try {
      const d = new Date(date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">{t("inbox.title")}</h2>
        {unreadTotal > 0 ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {t("inbox.unread", { count: unreadTotal })}
          </span>
        ) : null}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("inbox.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-xl pl-9"
        />
      </div>

      {/* Filter tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border bg-muted/30 p-1 sm:flex sm:items-center">
        {[
          { value: "all", label: t("inbox.tabs.all") },
          { value: "unread", label: t("inbox.tabs.unread") },
          { value: "buying", label: t("inbox.tabs.buying") },
          { value: "selling", label: t("inbox.tabs.selling") },
        ].map((tab) => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`w-full whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:flex-1 ${
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conversation list */}
      {filtered.length ? (
        <div className="space-y-1.5">
          {filtered.map((conv) => {
            const isBuyer = conv.buyerId === userId;
            const unread = isBuyer ? conv.buyerUnread : conv.sellerUnread;
            const counterpart = isBuyer ? conv.seller : conv.buyer;

            return (
              <Link
                key={conv.id}
                href={`${base}/messages/${conv.id}`}
                className={`flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-colors hover:border-primary/40 ${
                  unread ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/profile/${counterpart.id}`);
                    }}
                    className="block"
                  >
                    {counterpart.image ? (
                      <img
                        src={counterpart.image}
                        alt={counterpart.name ?? ""}
                        className="h-11 w-11 rounded-full object-cover transition-opacity hover:opacity-80"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary transition-opacity hover:opacity-80">
                        {(counterpart.companyName || counterpart.name || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </button>
                  {unread > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/profile/${counterpart.id}`);
                      }}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {counterpart.companyName || counterpart.name || t("inbox.unknown")}
                    </button>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {relativeTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {conv.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                    {conv.lastMessagePreview}
                  </p>
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
            <p className="font-semibold">
              {search ? t("inbox.noConversationsMatch") : t("inbox.noMessagesYet")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? t("inbox.tryDifferentSearch")
                : t("inbox.emptyInbox")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
