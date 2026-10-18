import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { MarketplaceAnalytics } from "@/components/dashboard/marketplace-analytics";
import { ActivityAndActions } from "@/components/dashboard/activity-and-actions";
import { RecommendedListings } from "@/components/dashboard/recommended-listings";
import { MarketplaceInsights } from "@/components/dashboard/marketplace-insights";
import { CommsAndAlerts } from "@/components/dashboard/comms-and-alerts";
import { CompanyProfileSummary } from "@/components/dashboard/company-profile-summary";
import { QuickShortcuts } from "@/components/dashboard/quick-shortcuts";
import {
  Search,
  Plus,
  User,
  Home,
  LayoutDashboard,
  Store,
  Package,
  Users,
  MessageSquare,
  Bell,
  Star,
  CreditCard,
  Shield,
  HelpCircle,
  Settings,
  BarChart3,
  FileText,
  Building2,
} from "lucide-react";

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

export default function DashboardPage() {
  return (
    <SidebarProvider className="">
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 flex items-center justify-between border-b px-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden w-full"
          >
            {/* Logo Icon - Always visible */}
            {/* <div className=" flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              <Building2 className="h-5 w-5" />
            </div> */}

            {/* Title Text - Automatically hidden when sidebar is collapsed */}
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CORE
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {coreItems.map((item) => (
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ANALYTICS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsItems.map((item) => (
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              COMMUNICATIONS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {communicationsItems.map((item) => (
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ACCOUNT
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SETTINGS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
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
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <MetricCards />
          <MarketplaceAnalytics />
          <ActivityAndActions />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecommendedListings />
              <MarketplaceInsights />
            </div>
            <div className="space-y-6">
              <CommsAndAlerts />
              <CompanyProfileSummary />
              <QuickShortcuts />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
