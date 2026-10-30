export type ListingType = "wanted" | "available";

export type ListingStatus =
  | "pending"
  | "active"
  | "rejected"
  | "expired"
  | "closed";

export type ListingRow = {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  location: string;
  durationDays: number;
  status: string;
  rejectionReason: string | null;
  expiresAt: Date | null;
  views: number;
  inquiries: number;
  qualityStandard: string | null;
  deliveryTimeline: string | null;
  preferredRegion: string | null;
  budgetRange: string | null;
  technicalDocument: string | null;
  images: string[];
  price: string | null;
  deliveryOptions: string | null;
  technicalSpecs: string | null;
  createdAt: Date;
  updatedAt: Date;
};
