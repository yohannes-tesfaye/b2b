export type ListingType = "wanted" | "available";

export type ListingStatus =
  | "pending"
  | "active"
  | "rejected"
  | "expired"
  | "closed";

export type ListingOwnerSummary = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean | null;
  image: string | null;
  companyName: string | null;
  phone: string | null;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
};

export type AdminListingRow = ListingRow & {
  user: ListingOwnerSummary | null;
};

export type ListingStatusHistoryEntry = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  createdAt: Date;
  changedBy: { id: string; name: string | null; email: string } | null;
};

export type AdminListingDetail = ListingRow & {
  reviewedAt: Date | null;
  moderationNotes: string | null;
  user: (ListingOwnerSummary & { _count: { listings: number } }) | null;
  reviewedBy: { id: string; name: string | null; email: string } | null;
  statusHistory: ListingStatusHistoryEntry[];
};

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
