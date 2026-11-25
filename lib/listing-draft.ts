import type { ListingRow, ListingType } from "@/types/listing";

/**
 * Crash-safe local draft for the listing wizard. Storage failures and corrupt
 * JSON are ignored so the form always stays usable.
 */
export const LISTING_DRAFT_KEY = "ethio-trade-listing-draft";
export const LISTING_STEP_COUNT = 4;

export type ListingDraftValues = {
  type: ListingType;
  title: string;
  description: string;
  category: string;
  quantity: string;
  location: string;
  durationDays: string;
  qualityStandard: string;
  deliveryTimeline: string;
  preferredRegion: string;
  budgetRange: string;
  technicalDocument: string;
  images: string;
  price: string;
  currency: string;
  moq: string;
  certifications: string;
  incoterms: string;
  originCountry: string;
  deliveryOptions: string;
  technicalSpecs: string;
};

export type ListingDraft = {
  values: Partial<ListingDraftValues>;
  step: number;
};

export function initialListingValues(
  type: ListingType,
  listing?: ListingRow | null
): ListingDraftValues {
  return {
    type:
      listing?.type === "available" || listing?.type === "wanted"
        ? listing.type
        : type,
    title: listing?.title ?? "",
    description: listing?.description ?? "",
    category: listing?.category ?? "",
    quantity: listing?.quantity ?? "",
    location: listing?.location ?? "",
    durationDays: String(listing?.durationDays ?? 30),
    qualityStandard: listing?.qualityStandard ?? "",
    deliveryTimeline: listing?.deliveryTimeline ?? "",
    preferredRegion: listing?.preferredRegion ?? "",
    budgetRange: listing?.budgetRange ?? "",
    technicalDocument: listing?.technicalDocument ?? "",
    images: (listing?.images ?? []).join("\n"),
    price: listing?.price ?? "",
    currency: listing?.currency ?? "",
    moq: listing?.moq ?? "",
    certifications: listing?.certifications ?? "",
    incoterms: listing?.incoterms ?? "",
    originCountry: listing?.originCountry ?? "",
    deliveryOptions: listing?.deliveryOptions ?? "",
    technicalSpecs: listing?.technicalSpecs ?? "",
  };
}

export function saveListingDraft(values: ListingDraftValues, step: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LISTING_DRAFT_KEY,
      JSON.stringify({ values, step })
    );
  } catch {
    // Storage can be full or blocked; the form still works without a draft.
  }
}

export function loadListingDraft(): ListingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LISTING_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Record<string, unknown>;
    const values: Partial<ListingDraftValues> = {};
    const textKeys = new Set(
      Object.keys(initialListingValues("available")).filter(
        (key) => key !== "type"
      )
    );
    if (record.values && typeof record.values === "object") {
      for (const [key, value] of Object.entries(record.values)) {
        if (key === "type") {
          if (value === "wanted" || value === "available") values.type = value;
        } else if (typeof value === "string" && textKeys.has(key)) {
          values[key as Exclude<keyof ListingDraftValues, "type">] = value;
        }
      }
    }

    const parsedStep = Number(record.step);
    const step = Number.isInteger(parsedStep)
      ? Math.min(Math.max(parsedStep, 0), LISTING_STEP_COUNT - 1)
      : 0;

    return { values, step };
  } catch {
    return null;
  }
}

export function clearListingDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LISTING_DRAFT_KEY);
  } catch {
    // Ignore blocked storage.
  }
}
