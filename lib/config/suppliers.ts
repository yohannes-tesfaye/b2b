/**
 * Supplier regions shown in the homepage bento. Add a region by appending one
 * object; the homepage and /suppliers both read from this list.
 */

export type SupplierRegion = {
  name: string;
  slug: string;
  countryCode: string;
  suppliers: number;
  lots: number;
};

export const SUPPLIER_REGIONS: SupplierRegion[] = [
  { name: "Ethiopia", slug: "ethiopia", countryCode: "ET", suppliers: 1240, lots: 480 },
  { name: "China", slug: "china", countryCode: "CN", suppliers: 320, lots: 210 },
  { name: "United States", slug: "united-states", countryCode: "US", suppliers: 180, lots: 95 },
  { name: "Germany", slug: "germany", countryCode: "DE", suppliers: 140, lots: 72 },
  { name: "India", slug: "india", countryCode: "IN", suppliers: 260, lots: 150 },
  { name: "United Kingdom", slug: "united-kingdom", countryCode: "GB", suppliers: 95, lots: 48 },
  { name: "Japan", slug: "japan", countryCode: "JP", suppliers: 110, lots: 60 },
  { name: "South Korea", slug: "south-korea", countryCode: "KR", suppliers: 88, lots: 44 },
];
