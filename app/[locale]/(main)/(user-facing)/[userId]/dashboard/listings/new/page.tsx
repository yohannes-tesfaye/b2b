import { defaultListingType } from "@/lib/listings";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { ListingForm } from "@/components/dashboard/listing-form";

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Post a new listing</h2>
        <p className="text-sm text-muted-foreground">
          Tell buyers or suppliers what you need or what you have available.
          Listings go live after admin approval.
        </p>
      </div>
      <ListingForm
        mode="create"
        defaultType={defaultListingType(user.role)}
        basePath={`${base}/listings`}
      />
    </div>
  );
}
