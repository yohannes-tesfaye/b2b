"use client";

import { useReducer, useSyncExternalStore } from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

const subscribe = () => () => {};

function readSaved(listingId: string) {
  try {
    return localStorage.getItem(`saved-listing:${listingId}`) === "1";
  } catch {
    return false;
  }
}

export function ProductShareSave({
  listingId,
  title,
}: {
  listingId: string;
  title: string;
}) {
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const saved = useSyncExternalStore(
    subscribe,
    () => readSaved(listingId),
    () => false
  );

  const toggleSave = () => {
    const next = !saved;
    try {
      localStorage.setItem(`saved-listing:${listingId}`, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    refresh();
    toast.success(next ? "Saved to your list" : "Removed from saved");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={share}
        aria-label="Share listing"
        className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
      >
        <Share2 className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-label={saved ? "Remove from saved" : "Save listing"}
        aria-pressed={saved}
        className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
      >
        <Heart
          className={cn(
            "h-[18px] w-[18px] transition-all",
            saved && "scale-110 fill-rose-500 text-rose-500"
          )}
        />
      </button>
    </div>
  );
}
