import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { defaultListingType } from "@/lib/listings";
import { requireOwnDashboard } from "@/lib/dashboard-access";
import { userDashboardPath } from "@/lib/dashboard-paths";
import { ListingForm } from "@/components/dashboard/listing-form";
import type { ListingRow } from "@/types/listing";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const { id, userId } = await params;
  const user = await requireOwnDashboard(userId);
  const base = userDashboardPath(user.id);

  const listing = await prisma.listing.findFirst({
    where: { id, userId: user.id },
  });

  if (!listing) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Edit listing</h2>
        <p className="text-sm text-muted-foreground">
          Saving changes submits this listing for approval again.
        </p>
      </div>
      <ListingForm
        mode="edit"
        defaultType={defaultListingType(user.role)}
        listing={listing as ListingRow}
        basePath={`${base}/listings`}
      />
    </div>
  );
}
