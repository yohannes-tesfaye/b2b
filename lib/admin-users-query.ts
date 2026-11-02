export type AdminUserQuery = {
  q: string;
  status: string;
  role: string;
  sort: string;
  page: number;
  pageSize: number;
};

export const DEFAULT_ADMIN_USER_QUERY: AdminUserQuery = {
  q: "",
  status: "all",
  role: "all",
  sort: "newest",
  page: 1,
  pageSize: 10,
};

export function adminUsersHref(query: AdminUserQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.role && query.role !== "all") params.set("role", query.role);
  if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.pageSize !== 10) params.set("pageSize", String(query.pageSize));
  const search = params.toString();
  return search ? `/users?${search}` : "/users";
}
