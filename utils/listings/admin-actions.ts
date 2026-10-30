"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";
import { parseRoles } from "@/lib/profile";

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
  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/listings", "page");
}

export async function approveListing(id: string): Promise<void> {
  await requireAdminUser();
  const result = await prisma.listing.updateMany({
    where: { id },
    data: { status: "active", rejectionReason: null },
  });
  if (!result.count) throw new Error("Listing not found");
  revalidateAllListings();
}

export async function rejectListing(id: string, reason: string): Promise<void> {
  await requireAdminUser();
  const result = await prisma.listing.updateMany({
    where: { id },
    data: { status: "rejected", rejectionReason: reason || null },
  });
  if (!result.count) throw new Error("Listing not found");
  revalidateAllListings();
}

export async function adminDeleteListing(id: string): Promise<void> {
  await requireAdminUser();
  const result = await prisma.listing.deleteMany({ where: { id } });
  if (!result.count) throw new Error("Listing not found");
  revalidateAllListings();
}

export async function adminCloseListing(id: string): Promise<void> {
  await requireAdminUser();
  const result = await prisma.listing.updateMany({
    where: { id },
    data: { status: "closed" },
  });
  if (!result.count) throw new Error("Listing not found");
  revalidateAllListings();
}
