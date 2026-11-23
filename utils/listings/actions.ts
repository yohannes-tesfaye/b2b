"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/listings";
import { buildListingSearchText } from "@/lib/search";
import { parseTagSlugs, tagSlugToLabel } from "@/lib/slug";
import { countryName } from "@/lib/countries";
import { listingIssuesToFieldErrors } from "@/lib/validation/listing";
import { listingSchema, type ListingFormValues, type ListingFormState } from "@/lib/validation/listing";

function parseListingForm(formData: FormData) {
  return listingSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    location: String(formData.get("location") ?? ""),
    countryCode: String(formData.get("countryCode") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    durationDays: String(formData.get("durationDays") ?? ""),
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
    countryCode: values.countryCode || null,
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
    currency: wanted ? null : values.currency || null,
    moq: wanted ? null : values.moq || null,
    certifications: wanted ? null : values.certifications || null,
    incoterms: wanted ? null : values.incoterms || null,
    originCountry: wanted ? null : values.originCountry || null,
  };
}

async function syncListingExtras(
  listingId: string,
  values: ListingFormValues,
  user: { companyName?: string | null }
) {
  const tagSlugs = parseTagSlugs(values.tags);

  if (tagSlugs.length) {
    await prisma.tag.createMany({
      data: tagSlugs.map((slug) => ({ slug, name: tagSlugToLabel(slug) })),
      skipDuplicates: true,
    });
  }

  const tags = tagSlugs.length
    ? await prisma.tag.findMany({
        where: { slug: { in: tagSlugs } },
        select: { id: true, slug: true, name: true },
      })
    : [];

  await prisma.listingTag.deleteMany({ where: { listingId } });
  if (tags.length) {
    await prisma.listingTag.createMany({
      data: tags.map((tag) => ({ listingId, tagId: tag.id })),
      skipDuplicates: true,
    });
  }

  const category = await prisma.category.findUnique({
    where: { slug: values.category },
    select: { name: true },
  });

  const countryCode = values.countryCode || null;

  const searchText = buildListingSearchText({
    title: values.title,
    description: values.description,
    category: values.category,
    categoryLabel: category?.name ?? null,
    location: values.location,
    countryCode,
    countryName: countryCode ? countryName(countryCode) : null,
    quantity: values.quantity,
    moq: values.moq || null,
    certifications: values.certifications || null,
    incoterms: values.incoterms || null,
    originCountry: values.originCountry || null,
    technicalSpecs: values.technicalSpecs || null,
    tags: tags.flatMap((tag) => [tag.slug, tag.name]),
    companyName: user.companyName ?? null,
  });

  await prisma.listing.update({
    where: { id: listingId },
    data: { countryCode, searchText },
  });
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
    const listing = await prisma.listing.create({
      data: {
        ...listingPayload(parsed.data),
        userId: user.id,
        // New listings always wait for admin approval. The expiry clock starts
        // when an admin approves the listing.
        status: "pending",
      },
    });

    await syncListingExtras(listing.id, parsed.data, { companyName: user.companyName });

    revalidateListings(user.id);

    return {
      status: "success",
      message: "Listing submitted for approval.",
      redirectTo: dashboardPath(user.id, "/listings"),
    };
  } catch {
    return {
      status: "error",
      message: "Could not save this listing. Please try again.",
    };
  }
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

    await syncListingExtras(id, parsed.data, { companyName: user.companyName });
    revalidateListings(user.id, id);

    return {
      status: "success",
      message: "Listing updated and submitted for approval.",
      redirectTo: dashboardPath(user.id, `/listings/${id}`),
    };
  } catch {
    return {
      status: "error",
      message: "Could not save this listing. Please try again.",
    };
  }
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

  await prisma.listing.updateMany({
    where: { id, userId: user.id },
    data: {
      // Renewals go back through approval as well, and the expiry clock
      // restarts when an admin approves the renewal.
      status: "pending",
      rejectionReason: null,
      expiresAt: null,
    },
  });

  revalidateListings(user.id, id);
}