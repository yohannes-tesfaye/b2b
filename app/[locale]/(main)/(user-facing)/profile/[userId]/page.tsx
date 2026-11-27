import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { ListingGrid } from "@/components/profile/ListingGrid";
import { effectiveStatus } from "@/lib/listings";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      companyName: true,
      phone: true,
      website: true,
      country: true,
      industry: true,
      companySize: true,
      bio: true,
      verified: true,
      createdAt: true,
    },
  });

  if (!user) notFound();

  // Fetch listings based on viewer role
  const listings = await prisma.listing.findMany({
    where: {
      userId,
      ...(isOwner ? {} : { status: "active" }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      category: true,
      images: true,
      location: true,
      price: true,
      budgetRange: true,
      views: true,
      inquiries: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  // Split into active vs private for owner view
  const activeListings = listings.filter(
    (l) => effectiveStatus(l) === "active"
  );
  const privateListings = isOwner
    ? listings.filter((l) => effectiveStatus(l) !== "active")
    : [];

  const activeCount = activeListings.length;
  const totalCount = listings.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-8">
      <PublicProfileHeader
        user={user}
        isOwner={isOwner}
        activeCount={activeCount}
        totalCount={totalCount}
      />

      <div className="mt-6">
        <ListingGrid
          listings={activeListings}
          isOwner={isOwner}
          showFilters
        />
      </div>

      {isOwner && privateListings.length > 0 ? (
        <div className="mt-8">
          <ListingGrid
            listings={privateListings}
            isPrivate
            isOwner={isOwner}
            showFilters={false}
          />
        </div>
      ) : null}
    </div>
  );
}
