/**
 * Supplier regions shown in the homepage bento. Add a region by appending one
 * object; the homepage and /suppliers both read from this list.
 */

export type SupplierRegion = {
  name: string;
  slug: string;
  flag: string;
  suppliers: number;
  lots: number;
};

export const SUPPLIER_REGIONS: SupplierRegion[] = [
  { name: "Ethiopia", slug: "ethiopia", flag: "🇪🇹", suppliers: 1240, lots: 480 },
  { name: "China", slug: "china", flag: "🇨🇳", suppliers: 320, lots: 210 },
  { name: "United States", slug: "united-states", flag: "🇺🇸", suppliers: 180, lots: 95 },
  { name: "Germany", slug: "germany", flag: "🇩🇪", suppliers: 140, lots: 72 },
  { name: "India", slug: "india", flag: "🇮🇳", suppliers: 260, lots: 150 },
  { name: "United Kingdom", slug: "united-kingdom", flag: "🇬🇧", suppliers: 95, lots: 48 },
  { name: "Japan", slug: "japan", flag: "🇯🇵", suppliers: 110, lots: 60 },
  { name: "South Korea", slug: "south-korea", flag: "🇰🇷", suppliers: 88, lots: 44 },
];
