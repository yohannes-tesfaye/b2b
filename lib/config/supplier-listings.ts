/**
 * Preview card facts for the homepage "Available goods" section.
 * Titles and country names stay in messages/product.json.
 */

export type SupplierListingId = "9" | "10" | "11" | "12";

export type SupplierListingPreview = {
  id: SupplierListingId;
  countryCode: string;
  category: string;
  quantity: string;
  timeLeft: string;
  rating: number;
};

export const SUPPLIER_LISTINGS: SupplierListingPreview[] = [
  {
    id: "9",
    countryCode: "ET",
    category: "Agriculture",
    quantity: "50 bags",
    timeLeft: "20 days left",
    rating: 4.8,
  },
  {
    id: "10",
    countryCode: "ET",
    category: "Oilseeds",
    quantity: "40 MT",
    timeLeft: "18 days left",
    rating: 4.7,
  },
  {
    id: "11",
    countryCode: "ET",
    category: "Food & beverage",
    quantity: "2,000 jars",
    timeLeft: "12 days left",
    rating: 4.9,
  },
  {
    id: "12",
    countryCode: "ET",
    category: "Grains",
    quantity: "25 MT",
    timeLeft: "30 days left",
    rating: 4.6,
  },
];
