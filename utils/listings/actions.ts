"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { addDays, effectiveStatus } from "@/lib/listings";
import { buildListingSearchText } from "@/lib/search";
import { parseTagSlugs, tagSlugToLabel } from "@/lib/slug";
import { countryName } from "@/lib/countries";
import {
  LISTING_FORM_FIELD_KEYS,
  listingIssuesToFieldErrors,
  listingSchema,
  type ListingFormValues,
  type ListingFormState,
} from "@/lib/validation/listing";

const SENSITIVE_KEY = /pass(word)?|secret|token|cookie|authorization/i;

/** Snapshot FormData for logs, with obvious secrets redacted. */
function readFormData(formData: FormData) {
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : String(value);
  }
  return data;
}

function newCallId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Pull the useful parts out of Prisma/driver errors without losing the raw error. */
function describeError(error: unknown) {
  const value = error as {
    name?: string;
    code?: string;
    message?: string;
    meta?: unknown;
    cause?: unknown;
  };
  return {
    name: value?.name ?? typeof error,
    code: value?.code ?? null,
    message: value?.message ?? String(error),
    meta: value?.meta ?? null,
    cause: value?.cause ?? null,
  };
}

function parseListingForm(formData: FormData) {
  // Build input from a canonical key list so FormData parsing can never drift
  // from `listingSchema`. Missing fields fall back to "".
  const data: Record<string, string> = {};
  for (const key of LISTING_FORM_FIELD_KEYS) {
    data[key] = String(formData.get(key) ?? "");
  }
  return listingSchema.safeParse(data);
}

function listingPayload(values: ListingFormValues) {
  const wanted = values.type === "wanted";
  // Both listing types can carry images (uploaded data URLs or links).
  const images = values.images
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
    // `currency` is NOT NULL with an ETB default in the deployed table, so an
    // empty value must be omitted rather than sent as null.
    currency: wanted ? undefined : values.currency || undefined,
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

function revalidateListings(_userId: string, listingId?: string) {
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/dashboard/listings", "page");
  if (listingId) {
    revalidatePath("/[locale]/dashboard/listings/[id]", "page");
  }
}

/** Dashboard path, used for redirects after writes. */
function dashboardPath(suffix = "") {
  return `/dashboard${suffix}`;
}

export async function createListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const callId = newCallId();
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  console.log("[createListing] start", {
    callId,
    startedAt,
    formDataKeys: Array.from(formData.keys()),
  });
  console.log("[createListing] incoming", {
    callId,
    startedAt,
    data: readFormData(formData),
  });

  const parsed = parseListingForm(formData);

  if (!parsed.success) {
    console.warn("[createListing] validation failed", {
      callId,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: listingIssuesToFieldErrors(parsed.error),
    };
  }

  console.log("[createListing] validation passed", {
    callId,
    type: parsed.data.type,
    title: parsed.data.title,
  });

  const user = await getCurrentUser();
  console.log("[createListing] session", {
    callId,
    hasUser: Boolean(user),
    userId: user?.id ?? null,
  });
  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please sign in again.",
      redirectTo: "/log-in",
    };
  }

  const payload = listingPayload(parsed.data);
  const saveData = {
    ...payload,
    userId: user.id,
    // Listings are auto-approved: published immediately, no admin review. The
    // expiry clock starts now.
    status: "active",
    expiresAt: addDays(new Date(), parsed.data.durationDays),
  };
  console.log("[createListing] saving", {
    callId,
    fields: Object.keys(saveData),
    data: saveData,
  });

  try {
    const listing = await prisma.listing.create({ data: saveData });
    console.log("[createListing] saved", {
      callId,
      listingId: listing.id,
      elapsedMs: Date.now() - startedMs,
    });

    await syncListingExtras(listing.id, parsed.data, { companyName: user.companyName });

    await prisma.listingStatusHistory.create({
      data: {
        listingId: listing.id,
        fromStatus: null,
        toStatus: "active",
        changedById: user.id,
      },
    });

    revalidateListings(user.id);

    return {
      status: "success",
      message: "Listing is live.",
      redirectTo: dashboardPath("/listings"),
    };
  } catch (error) {
    console.error("[createListing] failed", {
      callId,
      startedAt,
      failedAt: new Date().toISOString(),
      elapsedMs: Date.now() - startedMs,
      error: describeError(error),
      userId: user.id,
      fields: Object.keys(saveData),
      data: saveData,
    });
    console.error("[createListing] raw error", { callId, error });
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
        // Edits publish immediately, no admin re-review. The expiry clock
        // restarts now.
        status: "active",
        rejectionReason: null,
        expiresAt: addDays(new Date(), parsed.data.durationDays),
      },
    });
    if (!result.count) {
      return { status: "error", message: "Listing not found." };
    }
    await syncListingExtras(id, parsed.data, { companyName: user.companyName });
    revalidateListings(user.id, id);

    return {
      status: "success",
      message: "Listing updated and live.",
      redirectTo: dashboardPath(`/listings/${id}`),
    };
  } catch (error) {
    console.error("updateListing failed", error);
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
      // Renewals re-publish immediately, no admin re-approval. The expiry
      // clock restarts now.
      status: "active",
      rejectionReason: null,
      expiresAt: addDays(new Date(), listing.durationDays),
    },
  });

  revalidateListings(user.id, id);
}