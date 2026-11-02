export type AdminListingQuery = {
  q: string;
  status: string;
  type: string;
  category: string;
  sort: string;
  expiring: boolean;
  page: number;
  pageSize: number;
};

export const DEFAULT_ADMIN_LISTING_QUERY: AdminListingQuery = {
  q: "",
  status: "pending",
  type: "all",
  category: "all",
  sort: "newest",
  expiring: false,
  page: 1,
  pageSize: 10,
};

export function adminListingsHref(query: AdminListingQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status && query.status !== "pending") {
    params.set("status", query.status);
  }
  if (query.type && query.type !== "all") params.set("type", query.type);
  if (query.category && query.category !== "all") {
    params.set("category", query.category);
  }
  if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
  if (query.expiring) params.set("expiring", "1");
  if (query.page > 1) params.set("page", String(query.page));
  if (query.pageSize !== 10) params.set("pageSize", String(query.pageSize));
  const search = params.toString();
  return search ? `/dashboard/listing?${search}` : "/dashboard/listing";
}

