"use client";

import React from "react";
import Link from "next/link";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserMenu from "@/components/Auth/UserMenu";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  Bell,
  Home,
  Star,
  CreditCard,
  Shield,
  HelpCircle,
  Settings,
  Search,
  Plus,
  User,
  Building2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SidebarUserFooter } from "@/components/dashboard/sidebar-footer";

const coreItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "My Listings", url: "/listings", icon: Package },
  { title: "Contacts", url: "/contacts", icon: Users },
];

const analyticsItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
];

const communicationsItems = [
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const accountItems = [
  { title: "Company", url: "/company", icon: Home },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Membership", url: "/membership", icon: CreditCard },
  { title: "Verification", url: "/verification", icon: Shield },
];

const settingsItems = [
  { title: "Support", url: "/support", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

const userItems = [{ title: "Users", url: "/users", icon: User }];

type SidebarItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
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
}: {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null; role?: string | null };
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 flex items-center justify-between border-b px-3">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden w-full">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold leading-tight text-foreground truncate">
                B2B Marketplace
              </span>
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                Enterprise Portal
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {renderGroup("CORE", coreItems)}
          {renderGroup("ANALYTICS", analyticsItems)}
          {renderGroup("COMMUNICATIONS", communicationsItems)}
          {renderGroup("ACCOUNT", accountItems)}
          {renderGroup("USERS", userItems)}
          {renderGroup("SETTINGS", settingsItems)}
        </SidebarContent>
        <SidebarFooter>
          <SidebarUserFooter user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="h-9 w-9 shrink-0 rounded-md border border-border/60 bg-background hover:bg-muted" aria-label="Toggle sidebar" title="Toggle sidebar" />
          <div className="flex-1 min-w-0 text-center">
            <h1 className="text-xl font-bold text-foreground truncate">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products, suppliers..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Quick Create
            </button>
            <UserMenu />
          </div>
        </header>
        <div className="px-6 pt-3">
          <Breadcrumbs />
        </div>
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
