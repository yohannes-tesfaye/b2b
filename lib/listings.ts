import { parseRoles } from "@/lib/profile";
import type { ListingStatus, ListingType } from "@/types/listing";

const DAY_MS = 24 * 60 * 60 * 1000;

export const LISTING_TYPE_META: Array<{
  value: ListingType;
  label: string;
  description: string;
}> = [
  {
    value: "wanted",
    label: "Wanted",
    description: "I am looking to source or buy these goods.",
  },
  {
    value: "available",
    label: "Available",
    description: "I have goods or services available to sell.",
  },
];

export const LISTING_STATUS_META: Record<
  ListingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending approval", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  expired: { label: "Expired", variant: "outline" },
  closed: { label: "Closed", variant: "outline" },
};

export const LISTING_STATUS_VALUES: ListingStatus[] = [
  "pending",
  "active",
  "rejected",
  "expired",
  "closed",
];

export const LISTING_CATEGORIES = [
  { value: "agriculture", label: "Agriculture" },
  { value: "automotive", label: "Automotive" },
  { value: "chemicals", label: "Chemicals" },
  { value: "electronics", label: "Electronics" },
  { value: "food-beverage", label: "Food & beverage" },
  { value: "machinery", label: "Machinery" },
  { value: "services", label: "Services" },
  { value: "textiles", label: "Textiles" },
  { value: "other", label: "Other" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  buyer: "Buyer",
  supplier: "Supplier",
  "trade-service-provider": "Trade service provider",
  admin: "Admin",
  superadmin: "Super admin",
};

export function categoryLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return (
    LISTING_CATEGORIES.find((category) => category.value === value)?.label ??
    value
  );
}

export function typeLabel(value: string | null | undefined): string {
  return (
    LISTING_TYPE_META.find((type) => type.value === value)?.label ??
    (value ? value.charAt(0).toUpperCase() + value.slice(1) : "—")
  );
}

export function roleLabel(value: string): string {
  return (
    ROLE_LABELS[value] ??
    value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

/** Default listing type for a user, based on the roles on their profile. */
export function defaultListingType(role: string | null | undefined): ListingType {
  const roles = parseRoles(role);
  if (roles.includes("buyer")) return "wanted";
  if (roles.includes("supplier") || roles.includes("trade-service-provider")) {
    return "available";
  }
  return "wanted";
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/**
 * Active listings past their expiry date are shown as expired without needing
 * a background job to mutate the stored status.
 */
export function effectiveStatus(
  listing: Pick<{ status: string; expiresAt: Date | string | null }, "status" | "expiresAt">
): ListingStatus {
  const status = LISTING_STATUS_VALUES.includes(listing.status as ListingStatus)
    ? (listing.status as ListingStatus)
    : "pending";

  if (status === "active" && listing.expiresAt) {
    const expiry = new Date(listing.expiresAt).getTime();
    if (Number.isFinite(expiry) && expiry <= Date.now()) return "expired";
  }

  return status;
}

export function daysLeft(expiresAt: Date | string | null | undefined): number | null {
  if (!expiresAt) return null;
  const expiry = new Date(expiresAt).getTime();
  if (!Number.isFinite(expiry)) return null;
  return Math.ceil((expiry - Date.now()) / DAY_MS);
}

export function daysLeftLabel(expiresAt: Date | string | null | undefined): string {
  const days = daysLeft(expiresAt);
  if (days === null) return "—";
  if (days < 0) return "Expired";
  if (days === 0) return "Ends today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function isExpiringSoon(
  listing: Pick<{ status: string; expiresAt: Date | string | null }, "status" | "expiresAt">
): boolean {
  if (effectiveStatus(listing) !== "active") return false;
  const days = daysLeft(listing.expiresAt);
  return days !== null && days >= 0 && days <= 7;
}

export function formatListingDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
