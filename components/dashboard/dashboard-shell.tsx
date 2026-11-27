"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserMenu from "@/components/Auth/UserMenu";
import {
  Building2,
  ClipboardList,
  Heart,
  Inbox,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SidebarUserFooter } from "@/components/dashboard/sidebar-footer";
import { adminRoles } from "@/lib/permissions";
import { parseRoles } from "@/lib/profile";
import { cn } from "cn";

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  exact?: boolean;
};

function renderGroup(label: string, items: SidebarItem[]) {
  return (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
              {item.badge ? (
                <SidebarMenuBadge className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {item.badge > 99 ? "99+" : item.badge}
                </SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardShell({
  children,
  user,
  pendingListings = 0,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  pendingListings?: number;
  unreadCount?: number;
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
    companyName?: string | null;
    country?: string | null;
    industry?: string | null;
    companySize?: string | null;
    phone?: string | null;
    website?: string | null;
    emailVerified?: boolean | null;
    banned?: boolean | null;
    banReason?: string | null;
    createdAt?: Date | null;
  };
}) {
  const pathname = usePathname() || "";
  const inAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isThread = pathname.startsWith("/dashboard/messages/");
  const isAdmin = parseRoles(user.role).some((role) =>
    adminRoles.includes(role)
  );

  const userItems: SidebarItem[] = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: Inbox,
      badge: unreadCount,
    },
    {
      title: "My Listings",
      url: "/dashboard/listings",
      icon: ClipboardList,
    },
    { title: "New Listing", url: "/dashboard/listings/new", icon: Plus, exact: true },
    { title: "Favorites", url: "/dashboard/favorites", icon: Heart },
    { title: "Profile", url: "/dashboard/profile", icon: UserRound },
  ];

  if (isAdmin) {
    userItems.push({
      title: "Admin",
      url: "/admin",
      icon: ShieldCheck,
      exact: true,
    });
  }

  const adminItems: SidebarItem[] = [
    { title: "Overview", url: "/admin", icon: LayoutDashboard, exact: true },
    { title: "Users", url: "/admin/users", icon: Users },
    {
      title: "Listings",
      url: "/admin/listings",
      icon: ClipboardList,
      badge: pendingListings,
    },
    { title: "Taxonomy", url: "/admin/categories", icon: Tags },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex h-16 items-center justify-between border-b px-2">
          <Link
            href="/"
            className="flex w-full items-center gap-3 overflow-hidden"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-bold leading-tight text-foreground">
                B2B Marketplace
              </span>
              <span className="truncate text-[10px] font-medium text-muted-foreground">
                {inAdmin ? "Moderation console" : "Workspace"}
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {inAdmin
            ? renderGroup("MODERATION", adminItems)
            : renderGroup("WORKSPACE", userItems)}
        </SidebarContent>
        <SidebarFooter>
          <SidebarUserFooter user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger
            className="h-11 w-11 shrink-0 rounded-md border border-border/60 bg-background hover:bg-muted md:h-9 md:w-9"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          />
          <div className="min-w-0 flex-1">
            <h1 className="hidden truncate text-lg font-bold text-foreground md:block md:text-xl">
              {inAdmin ? "Admin" : "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <form
              action="/products"
              method="get"
              role="search"
              className="relative hidden w-56 lg:block xl:w-64"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                aria-label="Search listings"
                placeholder="Search products, suppliers..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>
            <Link
              href="/dashboard/listings/new"
              className="hidden h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:flex"
            >
              <Plus className="h-4 w-4" />
              New listing
            </Link>
            <div className="hidden md:block">
              <UserMenu variant="compact" unreadCount={unreadCount} />
            </div>
          </div>
        </header>
        {/* Mobile-only icon strip so dashboard nav is discoverable */}
        {!isThread ? (
        <div className="px-4 pt-2 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(inAdmin
              ? adminItems
              : userItems.filter((item) =>
                  ["My Listings", "Favorites"].includes(item.title)
                )
            ).map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.url
                : pathname === item.url || pathname.startsWith(`${item.url}/`);
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">{item.title}</span>
                  {item.badge ? (
                    <span className="ml-0.5 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
        ) : null}
        {!isThread ? (
        <div className="px-4 pt-3 md:px-6">
          <Breadcrumbs />
        </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
