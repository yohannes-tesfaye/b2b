"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "agriculture",
  "automotive",
  "chemicals",
  "electronics",
  "food-beverage",
  "machinery",
  "services",
  "textiles",
  "other",
];

export function MarketplaceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search listings, locations..."
          defaultValue={sp.get("q") ?? ""}
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <Select value={sp.get("type") ?? "all"} onValueChange={(v) => v && update("type", v)}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="wanted">Wanted</SelectItem>
          <SelectItem value="available">Available</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sp.get("category") ?? "all"} onValueChange={(v) => v && update("category", v)}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sp.get("sort") ?? "newest"} onValueChange={(v) => v && update("sort", v)}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="expiring">Expiring soon</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={() => router.replace(pathname)}>
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}