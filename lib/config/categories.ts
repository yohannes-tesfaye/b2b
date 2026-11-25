import {
  Car,
  Cog,
  FlaskConical,
  LayoutGrid,
  Shirt,
  Smartphone,
  Sprout,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { HeroMessageKey } from "./hero";

/**
 * Hero category menu. Links point at real /products filters, not placeholder
 * category routes. Add a category by appending one object.
 */

export type HeroCategory = {
  labelKey: HeroMessageKey;
  href: string;
  icon: LucideIcon;
};

export const HERO_CATEGORIES: HeroCategory[] = [
  {
    labelKey: "categoryAgriculture",
    href: "/products?category=agriculture",
    icon: Sprout,
  },
  {
    labelKey: "categoryFoodBeverage",
    href: "/products?category=food-beverage",
    icon: UtensilsCrossed,
  },
  {
    labelKey: "categoryTextiles",
    href: "/products?category=textiles",
    icon: Shirt,
  },
  {
    labelKey: "categoryMachinery",
    href: "/products?category=machinery",
    icon: Cog,
  },
  {
    labelKey: "categoryElectronics",
    href: "/products?category=electronics",
    icon: Smartphone,
  },
  {
    labelKey: "categoryChemicals",
    href: "/products?category=chemicals",
    icon: FlaskConical,
  },
  {
    labelKey: "categoryAutomotive",
    href: "/products?category=automotive",
    icon: Car,
  },
];

export const ALL_CATEGORIES: HeroCategory = {
  labelKey: "allCategories",
  href: "/products",
  icon: LayoutGrid,
};
