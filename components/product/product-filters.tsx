"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryOption } from "@/lib/listings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "cn";

export type ProductFilterOption = { value: string; label: string };

function formatLabel(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function ProductFilters({
  categories,
  industries,
  tags,
  countries,
}: {
  categories: CategoryOption[];
  industries: ProductFilterOption[];
  tags: Array<{ slug: string; name: string; count: number }>;
  countries: Array<ProductFilterOption & { count: number }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const pendingCategoryRef = useRef<string | null>(null);

  const currentParams = () =>
    typeof window !== "undefined" ? window.location.search : sp.toString();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams());
    params.delete("page");
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const updateMany = (next: Record<string, string>) => {
    const params = new URLSearchParams(currentParams());
    params.delete("page");
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const submitSearch = () => update("q", q.trim());

  const clear = () => {
    setQ("");
    pendingCategoryRef.current = "";
    router.replace(pathname);
  };

  const type = sp.get("type") ?? "all";
  const categoryParam = sp.get("category") ?? "";
  const parseCategories = (value: string | null) =>
    value ? Array.from(new Set(value.split(",").filter(Boolean))) : [];

  useEffect(() => {
    pendingCategoryRef.current = null;
  }, [categoryParam]);

  const selectedCategories = parseCategories(categoryParam);
  const sort = sp.get("sort") ?? "newest";
  const country = sp.get("country") ?? "all";
  const industry = sp.get("industry") ?? "all";
  const tag = sp.get("tag") ?? "";
  const activeCount =
    (type === "all" ? 0 : 1) +
    (selectedCategories.length ? 1 : 0) +
    (sp.get("q") ? 1 : 0) +
    (country === "all" ? 0 : 1) +
    (industry === "all" ? 0 : 1) +
    (tag ? 1 : 0);

  const toggleCategory = (c: string) => {
    const current = parseCategories(pendingCategoryRef.current ?? categoryParam);
    const next = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    pendingCategoryRef.current = next.join(",");
    update("category", pendingCategoryRef.current);
  };

  const categoryChips = (compact = false) => (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={selectedCategories.length === 0}
        onClick={() => {
          pendingCategoryRef.current = "";
          update("category", "");
        }}
        className={cn(
          "h-10 rounded-full border px-3 text-xs font-medium",
          selectedCategories.length === 0
            ? "border-primary bg-primary/10 text-primary"
            : "active:bg-muted"
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.value}
          type="button"
          aria-pressed={selectedCategories.includes(c.value)}
          onClick={() => toggleCategory(c.value)}
          className={cn(
            "h-10 rounded-full border px-3 text-xs font-medium",
            selectedCategories.includes(c.value)
              ? "border-primary bg-primary/10 text-primary"
              : "active:bg-muted",
            compact && "h-8 px-2.5"
          )}
        >
          {c.label || formatLabel(c.value)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Search + filter trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, categories, tags, locations..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            className="h-11 rounded-xl pl-9 pr-9"
          />
          {q ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQ("");
                update("q", "");
              }}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {/* Filters drawer (mobile + tablet) */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger
            render={
              <Button
                variant="outline"
                className="relative h-11 shrink-0 rounded-xl px-3 lg:hidden"
                aria-label="Filters and sorting"
              />
            }
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden xs:inline">Filters</span>
            {activeCount ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            ) : null}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-row items-start justify-between">
              <div>
                <DrawerTitle>Filters &amp; sort</DrawerTitle>
                <DrawerDescription>
                  Narrow down listings to find the right trade partner.
                </DrawerDescription>
              </div>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="h-11 w-11 rounded-full"
                    aria-label="Close filters"
                  />
                }
              >
                <X className="h-4 w-4" />
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Listing type
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "wanted", label: "Wanted" },
                    { value: "available", label: "Available" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update("type", t.value)}
                      className={cn(
                        "h-10 rounded-lg border text-sm font-medium transition-colors",
                        type === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "active:bg-muted"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Category
                </p>
                {categoryChips()}
              </div>

              {tags.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <button
                        key={t.slug}
                        type="button"
                        aria-pressed={tag === t.slug}
                        onClick={() => update("tag", tag === t.slug ? "" : t.slug)}
                        className={cn(
                          "h-10 rounded-full border px-3 text-xs font-medium",
                          tag === t.slug
                            ? "border-primary bg-primary/10 text-primary"
                            : "active:bg-muted"
                        )}
                      >
                        {t.name}
                        <span className="ml-1 text-muted-foreground">{t.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Country
                  </p>
                  <Select
                    value={country}
                    onValueChange={(v) => v && update("country", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All countries</SelectItem>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Industry
                  </p>
                  <Select
                    value={industry}
                    onValueChange={(v) => v && update("industry", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All industries</SelectItem>
                      {industries.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label || formatLabel(i.value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sort by
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "oldest", label: "Oldest" },
                    { value: "expiring", label: "Expiring" },
                    { value: "views", label: "Most viewed" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update("sort", s.value)}
                      className={cn(
                        "h-10 rounded-lg border text-sm font-medium transition-colors",
                        sort === s.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "active:bg-muted"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DrawerFooter className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <Button className="h-11 rounded-xl" onClick={() => setOpen(false)}>
                Show results
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => {
                  clear();
                  setOpen(false);
                }}
              >
                Clear filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Quick category chips (mobile) */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 scrollbar-none lg:hidden">
        <QuickChip
          active={selectedCategories.length === 0 && type === "all"}
          onClick={() => {
            pendingCategoryRef.current = "";
            updateMany({ type: "all", category: "" });
          }}
        >
          All
        </QuickChip>
        <QuickChip active={type === "wanted"} onClick={() => update("type", "wanted")}>
          Wanted
        </QuickChip>
        <QuickChip
          active={type === "available"}
          onClick={() => update("type", "available")}
        >
          Available
        </QuickChip>
        <span className="mx-0.5 w-px shrink-0 bg-border" />
        {categories.map((c) => (
          <QuickChip
            key={c.value}
            active={selectedCategories.includes(c.value)}
            onClick={() => toggleCategory(c.value)}
          >
            {c.label || formatLabel(c.value)}
          </QuickChip>
        ))}
      </div>

      {/* Desktop inline filters */}
      <div className="hidden flex-col gap-3 rounded-xl border bg-card p-4 lg:flex lg:flex-row lg:items-center">
        <Select value={type} onValueChange={(v) => v && update("type", v)}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="wanted">Wanted</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton
            render={
              <Button
                variant="outline"
                className="h-9 w-44 justify-between font-normal"
              />
            }
          >
            {selectedCategories.length
              ? `${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"}`
              : "All categories"}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedCategories.length === 0}
              onCheckedChange={() => update("category", "")}
            >
              All categories
            </DropdownMenuCheckboxItem>
            {categories.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.value}
                checked={selectedCategories.includes(c.value)}
                onCheckedChange={() => toggleCategory(c.value)}
              >
                {c.label || formatLabel(c.value)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {countries.length ? (
          <Select value={country} onValueChange={(v) => v && update("country", v)}>
            <SelectTrigger className="w-full lg:w-44" aria-label="Country">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select value={industry} onValueChange={(v) => v && update("industry", v)}>
          <SelectTrigger className="w-full lg:w-44" aria-label="Industry">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label || formatLabel(i.value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {tags.length ? (
          <Select value={tag || "all"} onValueChange={(v) => v && update("tag", v)}>
            <SelectTrigger className="w-full lg:w-40" aria-label="Tag">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.slug} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select value={sort} onValueChange={(v) => v && update("sort", v)}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="expiring">Expiring soon</SelectItem>
            <SelectItem value="views">Most viewed</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={clear}
          aria-label="Clear filters"
          className="h-11 w-11 lg:ml-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function QuickChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-xs font-medium transition-colors active:scale-95",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground"
      )}
    >
      {children}
    </button>
  );
}
