import {
  Factory,
  Home,
  LayoutGrid,
  Package,
  Route,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import type { Messages } from "@/i18n/request";
import type { NamespaceKey } from "./message-keys";

/**
 * Header navigation config.
 * Add or reorder links here — the desktop mega-menu and mobile drawer both
 * read from this file.
 */

/** Any valid string message key under the `header` namespace. */
export type HeaderMessageKey = NamespaceKey<Messages["header"]>;

export type NavLinkItem = {
  /** Message key under `header.nav`. */
  labelKey: HeaderMessageKey;
  /** Optional supporting copy shown in the desktop dropdown. */
  descriptionKey?: HeaderMessageKey;
  href: string;
  icon: LucideIcon;
};

export type HeaderNavEntry = {
  labelKey: HeaderMessageKey;
  href?: string;
  icon?: LucideIcon;
  /** When present the entry renders as a dropdown. */
  items?: NavLinkItem[];
};

/** Marketplace links, reused in the desktop dropdown and mobile drawer. */
export const PRODUCT_NAV_ITEMS: NavLinkItem[] = [
  {
    labelKey: "nav.availableGoods",
    descriptionKey: "nav.availableGoodsDescription",
    href: "/products?type=available",
    icon: Package,
  },
  {
    labelKey: "nav.wantedGoods",
    descriptionKey: "nav.wantedGoodsDescription",
    href: "/products?type=wanted",
    icon: ShoppingBasket,
  },
  {
    labelKey: "nav.suppliers",
    descriptionKey: "nav.suppliersDescription",
    href: "/#regions",
    icon: Factory,
  },
  {
    labelKey: "nav.howItWorks",
    descriptionKey: "nav.howItWorksDescription",
    href: "/#how-it-works",
    icon: Route,
  },
];

export const HEADER_NAV: HeaderNavEntry[] = [
  { labelKey: "nav.products", items: PRODUCT_NAV_ITEMS },
  { labelKey: "nav.suppliers", href: "/#regions", icon: Factory },
  { labelKey: "nav.howItWorks", href: "/#how-it-works", icon: Route },
];

export const MOBILE_NAV_LINKS: NavLinkItem[] = [
  { labelKey: "nav.home", href: "/", icon: Home },
  { labelKey: "nav.allProducts", href: "/products", icon: LayoutGrid },
  ...PRODUCT_NAV_ITEMS,
];
