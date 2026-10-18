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
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "My Listings", url: "/listings", icon: Package },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Company", url: "/company", icon: Home },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Membership", url: "/membership", icon: CreditCard },
  { title: "Verification", url: "/verification", icon: Shield },
  { title: "Support", url: "/support", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-lg font-bold px-4 py-2">B2B Marketplace</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products, suppliers, orders..."
                className="w-full pl-8 pr-4 py-2 text-sm border rounded-md bg-background"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Quick Create
            </button>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center cursor-pointer">
              <User className="h-4 w-4" />
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
