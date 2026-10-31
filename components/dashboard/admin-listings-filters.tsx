"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LISTING_CATEGORIES } from "@/lib/listings";
import {
  adminListingsHref,
  DEFAULT_ADMIN_LISTING_QUERY,
  type AdminListingQuery,
} from "@/lib/admin-listings-query";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
  { value: "closed", label: "Closed" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "expiring", label: "Expiring soon" },
];

export function AdminListingsFilters({ query }: { query: AdminListingQuery }) {
  const router = useRouter();
  const [localQ, setLocalQ] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  // Keep the input in sync when the URL changes (back/forward, reset).
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    setLocalQ(query.q);
  }

  const update = (patch: Partial<AdminListingQuery>) => {
    startTransition(() => {
      router.replace(adminListingsHref({ ...query, ...patch, page: 1 }));
    });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localQ !== query.q) update({ q: localQ });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <Tabs
        value={query.status}
        onValueChange={(value) =>
          update({ status: String(value), expiring: false })
        }
      >
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-2.5">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search title, owner, or listing ID..."
          value={localQ}
          onChange={(event) => setLocalQ(event.target.value)}
          className="w-full sm:w-64"
          aria-label="Search listings"
        />

        <Select
          value={query.type}
          onValueChange={(value) => value && update({ type: value })}
        >
          <SelectTrigger className="w-32" aria-label="Listing type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="wanted">Wanted</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={query.category}
          onValueChange={(value) => value && update({ category: value })}
        >
          <SelectTrigger className="w-40" aria-label="Category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {LISTING_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.sort}
          onValueChange={(value) => value && update({ sort: value })}
        >
          <SelectTrigger className="w-40" aria-label="Sort listings">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setLocalQ("");
            startTransition(() => {
              router.replace(adminListingsHref(DEFAULT_ADMIN_LISTING_QUERY));
            });
          }}
        >
          <RotateCcw />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
