"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { addDays } from "@/lib/listings";
import { adminRoles } from "@/lib/permissions";
import { parseRoles } from "@/lib/profile";
import {
  listingBulkRejectionSchema,
  listingModerationNoteSchema,
  listingRejectionSchema,
} from "@/lib/validation/listing";

async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const roles = parseRoles(user.role);
  if (!roles.some((role) => adminRoles.includes(role))) {
    throw new Error("Forbidden");
  }
  return user;
}

function revalidateAllListings() {
  revalidatePath("/[locale]/dashboard/created", "page");
  revalidatePath("/[locale]/listings", "page");
  revalidatePath("/[locale]/listings/[id]", "page");
  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/listings", "page");
  revalidatePath("/[locale]", "layout");
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  active: ["pending"],
  rejected: ["pending"],
  closed: ["pending", "active", "rejected", "expired"],
};

function assertTransition(from: string, to: string) {
  const allowed = ALLOWED_TRANSITIONS[to] ?? [];
  if (!allowed.includes(from)) {
    throw new Error(
      `Cannot change a ${from} listing to ${to}. Refresh and try again.`
    );
  }
}

function normaliseIds(ids: string[]) {
  const unique = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
  if (!unique.length) throw new Error("Select at least one listing.");
  if (unique.length > 100) {
    throw new Error("Select up to 100 listings at a time.");
  }
  return unique;
}

export async function approveListing(id: string): Promise<void> {
  const reviewer = await requireAdminUser();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({
      where: { id },
      select: { id: true, status: true, durationDays: true },
    });
    if (!listing) throw new Error("Listing not found");
    assertTransition(listing.status, "active");

    await tx.listing.update({
      where: { id },
      data: {
        status: "active",
        rejectionReason: null,
        reviewedById: reviewer.id,
        reviewedAt: now,
        // The listing's clock starts when it is approved, not when it was
        // submitted for review.
        expiresAt: addDays(now, listing.durationDays),
      },
    });
    await tx.listingStatusHistory.create({
      data: {
        listingId: id,
        fromStatus: listing.status,
        toStatus: "active",
        changedById: reviewer.id,
      },
    });
  });

  // TODO: notify the listing owner that their listing was approved.
  revalidateAllListings();
}

export async function rejectListing(id: string, reason: string): Promise<void> {
  const reviewer = await requireAdminUser();
  const parsed = listingRejectionSchema.safeParse({ reason });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "A reason is required.");
  }
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!listing) throw new Error("Listing not found");
    assertTransition(listing.status, "rejected");

    await tx.listing.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: parsed.data.reason,
        reviewedById: reviewer.id,
        reviewedAt: now,
      },
    });
    await tx.listingStatusHistory.create({
      data: {
        listingId: id,
        fromStatus: listing.status,
        toStatus: "rejected",
        reason: parsed.data.reason,
        changedById: reviewer.id,
      },
    });
  });

  // TODO: notify the listing owner that their listing was rejected.
  revalidateAllListings();
}

export async function adminCloseListing(id: string): Promise<void> {
  const reviewer = await requireAdminUser();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!listing) throw new Error("Listing not found");
    assertTransition(listing.status, "closed");

    await tx.listing.update({
      where: { id },
      data: {
        status: "closed",
        reviewedById: reviewer.id,
        reviewedAt: now,
      },
    });
    await tx.listingStatusHistory.create({
      data: {
        listingId: id,
        fromStatus: listing.status,
        toStatus: "closed",
        changedById: reviewer.id,
      },
    });
  });

  revalidateAllListings();
}

export async function adminDeleteListing(id: string): Promise<void> {
  await requireAdminUser();
  const result = await prisma.listing.deleteMany({ where: { id } });
  if (!result.count) throw new Error("Listing not found");
  revalidateAllListings();
}

export async function bulkApproveListings(
  ids: string[]
): Promise<{ updated: number }> {
  const reviewer = await requireAdminUser();
  const listingIds = normaliseIds(ids);
  const now = new Date();
  let updated = 0;

  await prisma.$transaction(async (tx) => {
    const listings = await tx.listing.findMany({
      where: { id: { in: listingIds }, status: "pending" },
      select: { id: true, status: true, durationDays: true },
    });

    for (const listing of listings) {
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          status: "active",
          rejectionReason: null,
          reviewedById: reviewer.id,
          reviewedAt: now,
          expiresAt: addDays(now, listing.durationDays),
        },
      });
      await tx.listingStatusHistory.create({
        data: {
          listingId: listing.id,
          fromStatus: listing.status,
          toStatus: "active",
          changedById: reviewer.id,
        },
      });
    }

    updated = listings.length;
  });

  // TODO: notify each listing owner that their listing was approved.
  revalidateAllListings();
  return { updated };
}

export async function bulkRejectListings(
  ids: string[],
  reason: string
): Promise<{ updated: number }> {
  const reviewer = await requireAdminUser();
  const parsed = listingBulkRejectionSchema.safeParse({ ids, reason });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "A reason is required.");
  }
  const listingIds = normaliseIds(parsed.data.ids);
  const now = new Date();
  let updated = 0;

  await prisma.$transaction(async (tx) => {
    const listings = await tx.listing.findMany({
      where: { id: { in: listingIds }, status: "pending" },
      select: { id: true, status: true },
    });

    for (const listing of listings) {
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          status: "rejected",
          rejectionReason: parsed.data.reason,
          reviewedById: reviewer.id,
          reviewedAt: now,
        },
      });
      await tx.listingStatusHistory.create({
        data: {
          listingId: listing.id,
          fromStatus: listing.status,
          toStatus: "rejected",
          reason: parsed.data.reason,
          changedById: reviewer.id,
        },
      });
    }

    updated = listings.length;
  });

  // TODO: notify each listing owner that their listing was rejected.
  revalidateAllListings();
  return { updated };
}

export async function updateListingModerationNotes(
  id: string,
  notes: string
): Promise<void> {
  await requireAdminUser();
  const parsed = listingModerationNoteSchema.safeParse({ notes });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid notes.");
  }

  const result = await prisma.listing.updateMany({
    where: { id },
    data: { moderationNotes: parsed.data.notes || null },
  });
  if (!result.count) throw new Error("Listing not found");

  revalidateAllListings();
}
