"use client";

import { useRef, useState } from "react";
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
import { LISTING_CATEGORIES as ALL_CATEGORIES } from "@/lib/listings";

const CATEGORIES = ALL_CATEGORIES.map((c) => c.value);
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

const label = (c: string) =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(sp.get("q") ?? "");

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
    router.replace(pathname);
  };

  const type = sp.get("type") ?? "all";
  const categoryParam = sp.get("category") ?? "";
  const parseCategories = (value: string) =>
    value ? Array.from(new Set(value.split(",").filter(Boolean))) : [];
  const categoriesRef = useRef<string[]>(parseCategories(categoryParam));
  const lastCategoryParam = useRef(categoryParam);
  if (lastCategoryParam.current !== categoryParam) {
    lastCategoryParam.current = categoryParam;
    categoriesRef.current = parseCategories(categoryParam);
  }
  const categories = categoriesRef.current;
  const sort = sp.get("sort") ?? "newest";
  const activeCount =
    (type === "all" ? 0 : 1) + (categories.length ? 1 : 0) + (sp.get("q") ? 1 : 0);

  const toggleCategory = (c: string) => {
    const current = categoriesRef.current;
    const next = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    categoriesRef.current = next;
    update("category", next.join(","));
  };

  return (
    <div className="space-y-3">
      {/* Search + filter trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, locations..."
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
                    className="h-10 w-10 rounded-full"
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
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={categories.length === 0}
                    onClick={() => update("category", "")}
                    className={cn(
                      "h-10 rounded-full border px-3 text-xs font-medium",
                      categories.length === 0
                        ? "border-primary bg-primary/10 text-primary"
                        : "active:bg-muted"
                    )}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={categories.includes(c)}
                      onClick={() => toggleCategory(c)}
                      className={cn(
                        "h-10 rounded-full border px-3 text-xs font-medium",
                        categories.includes(c)
                          ? "border-primary bg-primary/10 text-primary"
                          : "active:bg-muted"
                      )}
                    >
                      {label(c)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sort by
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "oldest", label: "Oldest" },
                    { value: "expiring", label: "Expiring" },
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
          active={categories.length === 0 && type === "all"}
          onClick={() => updateMany({ type: "all", category: "" })}
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
        {CATEGORIES.map((c) => (
          <QuickChip
            key={c}
            active={categories.includes(c)}
            onClick={() => toggleCategory(c)}
          >
            {label(c)}
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
            render={
              <Button
                variant="outline"
                className="h-9 w-44 justify-between font-normal"
              />
            }
          >
            {categories.length
              ? `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`
              : "All categories"}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={categories.length === 0}
              onCheckedChange={() => update("category", "")}
            >
              All categories
            </DropdownMenuCheckboxItem>
            {CATEGORIES.map((c) => (
              <DropdownMenuCheckboxItem
                key={c}
                checked={categories.includes(c)}
                onCheckedChange={() => toggleCategory(c)}
              >
                {label(c)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={sort} onValueChange={(v) => v && update("sort", v)}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="expiring">Expiring soon</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={clear} aria-label="Clear filters">
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
