/**
 * Preview card facts for the homepage "Wanted goods" section.
 * Titles and country names stay in messages/product.json.
 */

export type WantedListingId = "13" | "14" | "15" | "16";

export type WantedListingPreview = {
  id: WantedListingId;
  countryCode: string;
  category: string;
  quantity: string;
  timeLeft: string;
  rating: number;
};

export const WANTED_LISTINGS: WantedListingPreview[] = [
  {
    id: "13",
    countryCode: "KE",
    category: "Pulses",
    quantity: "500 drums",
    timeLeft: "14 days left",
    rating: 4.6,
  },
  {
    id: "14",
    countryCode: "DJ",
    category: "Food & beverage",
    quantity: "1,200 cases",
    timeLeft: "9 days left",
    rating: 4.8,
  },
  {
    id: "15",
    countryCode: "UG",
    category: "Fresh produce",
    quantity: "800 crates",
    timeLeft: "7 days left",
    rating: 4.7,
  },
  {
    id: "16",
    countryCode: "ET",
    category: "Spices",
    quantity: "300 kg",
    timeLeft: "21 days left",
    rating: 4.9,
  },
];
