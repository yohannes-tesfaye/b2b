import type { LucideIcon } from "lucide-react";
import { Handshake, Package, ShoppingCart } from "lucide-react";

export const PROFILE_ROLE_VALUES = [
  "supplier",
  "buyer",
  "trade-service-provider",
] as const;

export const INDUSTRY_VALUES = [
  "agriculture",
  "automotive",
  "electronics",
  "machinery",
  "textiles",
  "other",
] as const;

export const COMPANY_SIZE_VALUES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;

export type ProfileRole = (typeof PROFILE_ROLE_VALUES)[number];

export type RoleMeta = {
  value: ProfileRole;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
};

export const ROLE_META: RoleMeta[] = [
  {
    value: "supplier",
    labelKey: "roleSupplier",
    descriptionKey: "roleSupplierDesc",
    icon: Package,
  },
  {
    value: "buyer",
    labelKey: "roleBuyer",
    descriptionKey: "roleBuyerDesc",
    icon: ShoppingCart,
  },
  {
    value: "trade-service-provider",
    labelKey: "roleTradeServiceProvider",
    descriptionKey: "roleTradeServiceProviderDesc",
    icon: Handshake,
  },
];

export type IndustryMeta = { value: string; labelKey: string };

export const INDUSTRY_META: IndustryMeta[] = [
  { value: "agriculture", labelKey: "industryAgriculture" },
  { value: "automotive", labelKey: "industryAutomotive" },
  { value: "electronics", labelKey: "industryElectronics" },
  { value: "machinery", labelKey: "industryMachinery" },
  { value: "textiles", labelKey: "industryTextiles" },
  { value: "other", labelKey: "industryOther" },
];

export type CompanySizeMeta = { value: string; labelKey: string };

export const COMPANY_SIZE_META: CompanySizeMeta[] = [
  { value: "1-10", labelKey: "size1to10" },
  { value: "11-50", labelKey: "size11to50" },
  { value: "51-200", labelKey: "size51to200" },
  { value: "201-500", labelKey: "size201to500" },
  { value: "500+", labelKey: "size500plus" },
];

export function parseRoles(role: string | null | undefined): string[] {
  if (!role) return [];
  return role
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function initialsFrom(name: string | null | undefined, fallback = "?") {
  const source = (name ?? "").trim();
  if (!source) return fallback;
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}
