"use client";

import { useId, useRef, useState, useEffect } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { useRouter } from "@/i18n/navigation";

/**
 * Locale-aware product search. Submits to the real /products listing page.
 */
export function SearchBar({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  const t = useTranslations("header");
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.isComposing ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        (active instanceof HTMLElement && active.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(
      value ? `/products?q=${encodeURIComponent(value)}` : "/products"
    );
  };

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "group relative z-10 flex w-full items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1.5 transition-[transform,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none focus-within:scale-x-[1.06] focus-within:scale-y-[1.03] focus-within:border-ring/30 focus-within:shadow-[0_4px_16px_-4px_var(--ring)] focus-within:ring-2 focus-within:ring-ring/15",
        size === "lg" ? "h-11" : "h-10",
        className
      )}
    >
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
      <label htmlFor={inputId} className="sr-only">
        {t("search")}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd
        className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground xl:inline-flex"
        aria-hidden
      >
        <CornerDownLeft className="size-3" />
        Enter
      </kbd>
      <button
        type="submit"
        className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:h-8"
      >
        {t("search")}
      </button>
    </form>
  );
}
