import { defaultListingType } from "@/lib/listings";
import { requireUser } from "@/lib/dashboard-access";
import { ListingForm } from "@/components/dashboard/listing-form";

export default async function NewListingPage() {
  const user = await requireUser();
  const base = "/dashboard";

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
