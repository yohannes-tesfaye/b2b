"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/listings";
import {
  listingIssuesToFieldErrors,
  listingSchema,
  type ListingFormState,
  type ListingFormValues,
} from "@/lib/validation/listing";

function parseListingForm(formData: FormData) {
  return listingSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    location: String(formData.get("location") ?? ""),
    durationDays: String(formData.get("durationDays") ?? ""),
    qualityStandard: String(formData.get("qualityStandard") ?? ""),
    deliveryTimeline: String(formData.get("deliveryTimeline") ?? ""),
    preferredRegion: String(formData.get("preferredRegion") ?? ""),
    budgetRange: String(formData.get("budgetRange") ?? ""),
    technicalDocument: String(formData.get("technicalDocument") ?? ""),
    images: String(formData.get("images") ?? ""),
    price: String(formData.get("price") ?? ""),
    deliveryOptions: String(formData.get("deliveryOptions") ?? ""),
    technicalSpecs: String(formData.get("technicalSpecs") ?? ""),
  });
}

function listingPayload(values: ListingFormValues) {
  const wanted = values.type === "wanted";
  const images = wanted
    ? []
    : values.images
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

  return {
    type: values.type,
    title: values.title,
    description: values.description,
    category: values.category,
    quantity: values.quantity,
    location: values.location,
    durationDays: values.durationDays,
    qualityStandard: wanted ? values.qualityStandard : null,
    deliveryTimeline: wanted ? values.deliveryTimeline : null,
    preferredRegion: wanted ? values.preferredRegion : null,
    budgetRange: wanted ? values.budgetRange : null,
    technicalDocument: wanted ? values.technicalDocument || null : null,
    images,
    price: wanted ? null : values.price,
    deliveryOptions: wanted ? null : values.deliveryOptions,
    technicalSpecs: wanted ? null : values.technicalSpecs || null,
  };
}

function revalidateListings(userId: string, listingId?: string) {
  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/listings", "page");
  if (listingId) {
    revalidatePath("/[locale]/[userId]/dashboard/listings/[id]", "page");
  }
}

/** Personal dashboard path for a user, used for redirects after writes. */
function dashboardPath(userId: string, suffix = "") {
  return `/${userId}/dashboard${suffix}`;
}

export async function createListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const parsed = parseListingForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: listingIssuesToFieldErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again.",
      redirectTo: "/log-in",
    };
  }

  try {
    await prisma.listing.create({
      data: {
        ...listingPayload(parsed.data),
        userId: user.id,
        // New listings always wait for admin approval. The expiry clock starts
        // when an admin approves the listing.
        status: "pending",
      },
    });
  } catch {
    return {
      status: "error",
      message: "Could not save this listing. Please try again.",
    };
  }

  revalidateListings(user.id);

  return {
    status: "success",
    message: "Listing submitted for approval.",
    redirectTo: dashboardPath(user.id, "/listings"),
  };
}

export async function updateListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { status: "error", message: "Listing not found." };
  }

  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: listingIssuesToFieldErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again.",
      redirectTo: "/log-in",
    };
  }

  try {
    // Scope the write to the owner so another user's listing can never be
    // updated, even if the id is tampered with.
    const result = await prisma.listing.updateMany({
      where: { id, userId: user.id },
      data: {
        ...listingPayload(parsed.data),
        // Edits need to be reviewed again. This also moves an active listing
        // back to pending, which is the simplest acceptable workflow. The
        // expiry clock restarts on approval.
        status: "pending",
        rejectionReason: null,
        expiresAt: null,
      },
    });
    if (!result.count) {
      return { status: "error", message: "Listing not found." };
    }
  } catch {
    return {
      status: "error",
      message: "Could not save this listing. Please try again.",
    };
  }

  revalidateListings(user.id, id);

  return {
    status: "success",
    message: "Listing updated and submitted for approval.",
    redirectTo: dashboardPath(user.id, `/listings/${id}`),
  };
}

export async function deleteListing(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const result = await prisma.listing.deleteMany({
    where: { id, userId: user.id },
  });
  if (!result.count) throw new Error("Listing not found");

  revalidateListings(user.id, id);
}

export async function closeListing(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const result = await prisma.listing.updateMany({
    where: { id, userId: user.id },
    data: { status: "closed" },
  });
  if (!result.count) throw new Error("Listing not found");

  revalidateListings(user.id, id);
}

export async function renewListing(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const listing = await prisma.listing.findFirst({
    where: { id, userId: user.id },
    select: { id: true, status: true, expiresAt: true, durationDays: true },
  });
  if (!listing) throw new Error("Listing not found");
  if (effectiveStatus(listing) !== "expired") {
    throw new Error("Only expired listings can be renewed");
  }

  const result = await prisma.listing.updateMany({
    where: { id, userId: user.id },
    data: {
      // Renewals go back through approval as well, and the expiry clock
      // restarts when an admin approves the renewal.
      status: "pending",
      rejectionReason: null,
      expiresAt: null,
    },
  });
  if (!result.count) throw new Error("Listing not found");

  revalidateListings(user.id, id);
}
