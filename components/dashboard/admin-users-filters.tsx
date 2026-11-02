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
import { ROLE_LABELS } from "@/lib/listings";
import {
  adminUsersHref,
  DEFAULT_ADMIN_USER_QUERY,
  type AdminUserQuery,
} from "@/lib/admin-users-query";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
  { value: "listings", label: "Most listings" },
];

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function AdminUsersFilters({ query }: { query: AdminUserQuery }) {
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

  const update = (patch: Partial<AdminUserQuery>) => {
    startTransition(() => {
      router.replace(adminUsersHref({ ...query, ...patch, page: 1 }));
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
        onValueChange={(value) => update({ status: String(value) })}
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
          placeholder="Search name, email, company, or country..."
          value={localQ}
          onChange={(event) => setLocalQ(event.target.value)}
          className="w-full sm:w-64"
          aria-label="Search users"
        />

        <Select
          value={query.role}
          onValueChange={(value) => value && update({ role: value })}
        >
          <SelectTrigger className="w-40" aria-label="User role">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.sort}
          onValueChange={(value) => value && update({ sort: value })}
        >
          <SelectTrigger className="w-40" aria-label="Sort users">
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
              router.replace(adminUsersHref(DEFAULT_ADMIN_USER_QUERY));
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
