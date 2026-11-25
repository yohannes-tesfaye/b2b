"use client";

import { Check, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { ListingRefCard } from "./ListingRefCard";

interface ChatBubbleProps {
  body: string;
  isOwn: boolean;
  timestamp: Date | string;
  isRead?: boolean;
  showAvatar?: boolean;
  avatarFallback?: string;
  isGrouped?: boolean;
  attachment?: string | null;
  senderId?: string;
  listing?: {
    id: string;
    title: string;
    image?: string | null;
    meta?: string | null;
  } | null;
}

export function ChatBubble({
  body,
  isOwn,
  timestamp,
  isRead = false,
  showAvatar = false,
  avatarFallback = "?",
  isGrouped = false,
  attachment,
  senderId,
  listing,
}: ChatBubbleProps) {
  const time = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwn ? "justify-end" : "justify-start",
        isGrouped ? "mt-0.5" : "mt-3"
      )}
    >
      {!isOwn && showAvatar ? (
        senderId ? (
          <Link href={`/${senderId}`} className="shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-opacity hover:opacity-80">
              {avatarFallback}
            </div>
          </Link>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {avatarFallback}
          </div>
        )
      ) : !isOwn ? (
        <div className="w-7 shrink-0" />
      ) : null}

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[60%]",
          isOwn
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        )}
      >
        {listing ? (
          <div className="mb-1.5">
            <ListingRefCard
              id={listing.id}
              title={listing.title}
              image={listing.image}
              meta={listing.meta}
              isOwn={isOwn}
            />
          </div>
        ) : null}
        {attachment ? (
          <div className="mb-1.5">
            {attachment.startsWith("data:image/") ? (
              <img
                src={attachment}
                alt="Attachment"
                className="max-h-48 rounded-lg object-cover"
              />
            ) : (
              <a
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs",
                  isOwn ? "bg-primary-foreground/20" : "bg-background/50"
                )}
              >
                📎 Attachment
              </a>
            )}
          </div>
        ) : null}
        {body ? <p className="whitespace-pre-wrap break-words">{body}</p> : null}
        <div
          className={cn(
            "mt-1 flex items-center gap-1",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-[10px]",
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {time}
          </span>
          {isOwn ? (
            isRead ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
            ) : (
              <Check className="h-3 w-3 text-primary-foreground/70" />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
