import { MetricCards } from "@/components/dashboard/metric-cards";
import { MarketplaceAnalytics } from "@/components/dashboard/marketplace-analytics";
import { ActivityAndActions } from "@/components/dashboard/activity-and-actions";
import { RecommendedListings } from "@/components/dashboard/recommended-listings";
import { MarketplaceInsights } from "@/components/dashboard/marketplace-insights";
import { CommsAndAlerts } from "@/components/dashboard/comms-and-alerts";
import { CompanyProfileSummary } from "@/components/dashboard/company-profile-summary";
import { QuickShortcuts } from "@/components/dashboard/quick-shortcuts";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
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
  );
}
