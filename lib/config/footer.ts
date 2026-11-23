import type { Messages } from "@/i18n/request";
import type { NamespaceKey } from "./message-keys";

/**
 * Footer link config. Adding a footer destination is a one-line change here.
 */

export type FooterMessageKey = NamespaceKey<Messages["footer"]>;

export type FooterLinkItem = {
  labelKey: FooterMessageKey;
  href: string;
};

export type FooterColumn = {
  titleKey: FooterMessageKey;
  links: FooterLinkItem[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    titleKey: "columns.marketplace",
    links: [
      { labelKey: "links.availableGoods", href: "/products?type=available" },
      { labelKey: "links.wantedGoods", href: "/products?type=wanted" },
      { labelKey: "links.suppliers", href: "/#regions" },
    ],
  },
  {
    titleKey: "columns.company",
    links: [
      { labelKey: "links.howItWorks", href: "/#how-it-works" },
      { labelKey: "links.sell", href: "/sign-up" },
      { labelKey: "links.contact", href: "/contact" },
    ],
  },
  {
    titleKey: "columns.support",
    links: [
      { labelKey: "links.help", href: "/help" },
      { labelKey: "links.terms", href: "/terms" },
      { labelKey: "links.privacy", href: "/privacy" },
    ],
  },
];
