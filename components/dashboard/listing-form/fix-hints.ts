export type FixKey =
  | "title"
  | "description"
  | "category"
  | "quantity"
  | "location"
  | "durationDays"
  | "qualityStandard"
  | "deliveryTimeline"
  | "preferredRegion"
  | "budgetRange"
  | "technicalDocument"
  | "price"
  | "deliveryOptions"
  | "images"
  | "generic";

/** Field id -> listingForm.fix.* key for the one-line suggested fix. */
export const FIX_KEY_BY_FIELD: Record<string, FixKey> = {
  title: "title",
  description: "description",
  category: "category",
  quantity: "quantity",
  location: "location",
  durationDays: "durationDays",
  qualityStandard: "qualityStandard",
  deliveryTimeline: "deliveryTimeline",
  preferredRegion: "preferredRegion",
  budgetRange: "budgetRange",
  technicalDocument: "technicalDocument",
  price: "price",
  deliveryOptions: "deliveryOptions",
  images: "images",
};
