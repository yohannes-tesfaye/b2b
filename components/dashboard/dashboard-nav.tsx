"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { LayoutDashboard, Package, Plus, User } from "lucide-react";
import { cn } from "cn";
import { userDashboardPath } from "@/lib/dashboard-paths";

export function DashboardNav({ userId }: { userId: string }) {
  const pathname = usePathname() || "";
  const base = userDashboardPath(userId);
  const listings = `${base}/listings`;
  const newListing = `${listings}/new`;

  const items = [
    { title: "Overview", url: base, icon: LayoutDashboard },
    { title: "My Listings", url: listings, icon: Package },
    { title: "New Listing", url: newListing, icon: Plus },
    { title: "Profile", url: "/profile", icon: User },
  ];

  return (
    <nav
      aria-label="Dashboard sections"
      className="flex flex-wrap items-center gap-1 rounded-xl border bg-muted/30 p-1"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.url === listings
            ? pathname === listings ||
              (pathname.startsWith(`${listings}/`) &&
                !pathname.startsWith(newListing))
            : pathname === item.url;

        return (
          <Link
            key={item.url}
            href={item.url}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
