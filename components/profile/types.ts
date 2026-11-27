export type PublicProfileListing = {
  id: string;
  title: string;
  type: string;
  status: string;
  category: string | null;
  images: string[];
  location: string;
  price: string | null;
  currency: string | null;
  budgetRange: string | null;
  quantity: string;
  originCountry: string | null;
  countryCode: string | null;
  views: number;
  inquiries: number;
  createdAt: Date | string;
  expiresAt: Date | string | null;
};

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  companyName?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  industry?: string | null;
  companySize?: string | null;
  bio?: string | null;
  createdAt?: string | Date | null;
};
