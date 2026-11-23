import type { Messages } from "@/i18n/request";
import type { NamespaceKey } from "./message-keys";

/**
 * Hero media config.
 *
 * Swapping a placeholder for a real product photo is a one-line change here.
 * Every image is a remote URL, so the host must be allowed in next.config.ts.
 */

export type HeroMessageKey = NamespaceKey<Messages["hero"]>;

export type HeroImage = {
  src: string;
  altKey: HeroMessageKey;
};

export type HeroSlide = HeroImage & {
  labelKey: HeroMessageKey;
};

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const HERO_SLIDES: HeroSlide[] = [
  {
    src: unsplash("photo-1596040033229-a9821ebd058d", 1400),
    labelKey: "spicesLabel",
    altKey: "spicesAlt",
  },
  {
    src: unsplash("photo-1586201375761-83865001e31c", 1400),
    labelKey: "grainsLabel",
    altKey: "grainsAlt",
  },
  {
    src: unsplash("photo-1587049352846-4a222e784d38", 1400),
    labelKey: "honeyLabel",
    altKey: "honeyAlt",
  },
];

export const PROMO_IMAGE: HeroImage = {
  src: unsplash("photo-1447933601403-0c6688de566e", 900),
  altKey: "promoImageAlt",
};

export const SUPPLY_THUMBNAILS: HeroImage[] = [
  {
    src: unsplash("photo-1447933601403-0c6688de566e", 320),
    altKey: "coffeeAlt",
  },
  {
    src: unsplash("photo-1596040033229-a9821ebd058d", 320),
    altKey: "spicesAlt",
  },
  {
    src: unsplash("photo-1586201375761-83865001e31c", 320),
    altKey: "grainsAlt",
  },
  {
    src: unsplash("photo-1587049352846-4a222e784d38", 320),
    altKey: "honeyAlt",
  },
];
