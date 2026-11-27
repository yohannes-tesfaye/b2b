import { Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";

export interface ListingRefCardProps {
  id: string;
  title: string;
  image?: string | null;
  meta?: string | null; // e.g. "Agriculture · 5000 meters"
  isOwn?: boolean; // true when the card is inside the sender's own (primary-colored) bubble
}

/**
 * Telegram-style "reply preview" card that points at the marketplace listing
 * a chat message is about. Rendered above the message text inside a bubble.
 */
export function ListingRefCard({
  id,
  title,
  image,
  meta,
  isOwn = false,
}: ListingRefCardProps) {
  const hasImage = typeof image === "string" && image.trim() !== "";
  const hasMeta = typeof meta === "string" && meta.trim() !== "";

  return (
    <Link
      href={`/products/${id}`}
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-hidden rounded-lg border-l-[3px] py-1.5 pl-2 pr-2 transition-opacity hover:opacity-90",
        isOwn
          ? "border-primary-foreground/60 bg-primary-foreground/10"
          : "border-brand bg-background/60"
      )}
    >
      {hasImage ? (
        <img
          src={image}
          alt={title}
          className="h-9 w-9 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            isOwn
              ? "bg-primary-foreground/20 text-primary-foreground/70"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Package className="h-4 w-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs font-semibold leading-tight",
            isOwn ? "text-primary-foreground" : "text-brand"
          )}
        >
          {title}
        </p>
        {hasMeta ? (
          <p
            className={cn(
              "truncate text-[11px] leading-tight",
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {meta}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
