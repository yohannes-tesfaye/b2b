"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ProductShareSave({
  title,
}: {
  listingId: string;
  title: string;
}) {
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
    <button
      type="button"
      onClick={share}
      aria-label="Share listing"
      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
    >
      <Share2 className="h-[18px] w-[18px]" />
    </button>
  );
}
