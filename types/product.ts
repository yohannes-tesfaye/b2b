export interface Variant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  country: string;
  countryFlag: string;
  verified: boolean;
  rating: number;
  responseRate: string;
  responseTime: string;
  joinedDate: string;
  badges: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface Product {
  id: string;
  title: string;
  images: string[];
  priceRange: {
    min: number;
    max: number;
  };
  currency: string;
  moq: number;
  variants: Variant[];
  specifications: Specification[];
  supplier: Supplier;
  description: string;
  fullSpecs: Specification[];
  advantages: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}
