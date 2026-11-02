"use client";

import { useMemo, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  BadgeCheck,
  Building2,
  MoreHorizontal,
  Package,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BanUserDialog,
  DeleteUserDialog,
  UnbanUserDialog,
  type UserTarget,
} from "@/components/dashboard/admin-user-dialogs";
import { initialsFrom, parseRoles } from "@/lib/profile";
import { roleLabel } from "@/lib/listings";
import {
  adminUsersHref,
  type AdminUserQuery,
} from "@/lib/admin-users-query";
import type { AdminUserRow } from "@/types/user";

type DialogState =
  | { type: "ban" | "unban" | "delete"; user: AdminUserRow }
  | null;

function pageNumbers(current: number, total: number) {
  const pages = new Set<number>([1, total]);
  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page > 1 && page < total) pages.add(page);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

function roleVariant(role: string) {
  return role === "admin" || role === "superadmin" ? "secondary" : "outline";
}

function RoleBadges({ role }: { role: string | null }) {
  const roles = parseRoles(role);
  const values = roles.length ? roles : ["buyer"];

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => (
        <Badge key={value} variant={roleVariant(value)}>
          {roleLabel(value)}
        </Badge>
      ))}
    </div>
  );
}

function UserCell({
  user,
  isSelf,
}: {
  user: AdminUserRow;
  isSelf: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
        {user.image ? (
          <AvatarImage src={user.image} alt={user.name || user.email} />
        ) : null}
        <AvatarFallback className="text-xs">
          {initialsFrom(user.name || user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-medium">
            {user.name || "Unnamed"}
          </span>
          {user.emailVerified ? (
            <BadgeCheck
              className="size-3.5 shrink-0 text-primary"
              aria-label="Verified account"
            />
          ) : null}
          {isSelf ? (
            <Badge variant="outline" className="ml-0.5">
              You
            </Badge>
          ) : null}
        </div>
        <span className="block truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ user }: { user: AdminUserRow }) {
  return user.banned ? (
    <Badge variant="destructive">Banned</Badge>
  ) : (
    <Badge variant="outline">Active</Badge>
  );
}

function UserActions({
  user,
  isSelf,
  onAction,
}: {
  user: AdminUserRow;
  isSelf: boolean;
  onAction: (type: "ban" | "unban" | "delete") => void;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${user.name || user.email}`}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>User</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/dashboard/user/${user.id}`)}>
          View details
        </DropdownMenuItem>
        {isSelf ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              This is your account
            </DropdownMenuLabel>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            {user.banned ? (
              <DropdownMenuItem onClick={() => onAction("unban")}>
                Unban user
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onAction("ban")}>
                Ban user
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onAction("delete")}
            >
              Delete user
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminUsersTable({
  users,
  total,
  query,
  currentUserId,
}: {
  users: AdminUserRow[];
  total: number;
  query: AdminUserQuery;
  currentUserId: string;
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>(null);

  const selectedUser = dialog?.user ?? null;
  const target = useMemo<UserTarget | null>(
    () =>
      selectedUser
        ? {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
          }
        : null,
    [selectedUser]
  );

  const goToPage = (page: number) => {
    router.replace(adminUsersHref({ ...query, page }));
  };

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const pages = pageNumbers(query.page, totalPages);
  const hasFilters = Boolean(
    query.q || query.status !== "all" || query.role !== "all"
  );

  return (
    <div className="space-y-4">
      <div className="hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/user/${user.id}`)}
                  >
                    <TableCell className="max-w-72">
                      <UserCell user={user} isSelf={isSelf} />
                    </TableCell>
                    <TableCell>
                      <RoleBadges role={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge user={user} />
                    </TableCell>
                    <TableCell className="max-w-48">
                      <div className="min-w-0">
                        <span className="flex items-center gap-1.5 truncate text-sm">
                          <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                          {user.companyName || "—"}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {user.industry
                            ? roleLabel(user.industry)
                            : user.country || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <Package className="size-3.5 text-muted-foreground" />
                        {user._count.listings}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <UserActions
                        user={user}
                        isSelf={isSelf}
                        onAction={(type) => setDialog({ type, user })}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40">
                  <EmptyState hasFilters={hasFilters} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {users.length ? (
          users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <Card
                key={user.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/user/${user.id}`)}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <UserCell user={user} isSelf={isSelf} />
                    </div>
                    <div onClick={(event) => event.stopPropagation()}>
                      <UserActions
                        user={user}
                        isSelf={isSelf}
                        onAction={(type) => setDialog({ type, user })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge user={user} />
                    <RoleBadges role={user.role} />
                  </div>

                  <div className="flex items-end justify-between gap-3 text-xs text-muted-foreground">
                    <div className="min-w-0">
                      <p className="truncate">{user.companyName || "No company"}</p>
                      <p className="truncate">
                        {user.industry
                          ? roleLabel(user.industry)
                          : user.country || "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p>
                        {user._count.listings} listing
                        {user._count.listings === 1 ? "" : "s"}
                      </p>
                      <p>Joined {user.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="rounded-xl border p-6">
            <EmptyState hasFilters={hasFilters} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total} user{total === 1 ? "" : "s"} total
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(query.pageSize)}
            onValueChange={(value) =>
              value &&
              router.replace(
                adminUsersHref({
                  ...query,
                  pageSize: Number(value),
                  page: 1,
                })
              )
            }
          >
            <SelectTrigger className="w-24" aria-label="Users per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
            </SelectContent>
          </Select>

          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(Math.max(1, query.page - 1))}
                  disabled={query.page <= 1}
                >
                  Previous
                </Button>
              </PaginationItem>
              {pages.map((page, index) => {
                const previous = pages[index - 1];
                return (
                  <PaginationItem key={page} className="hidden sm:block">
                    {previous && page - previous > 1 ? (
                      <span className="px-1 text-xs text-muted-foreground">…</span>
                    ) : null}
                    <Button
                      variant={page === query.page ? "outline" : "ghost"}
                      size="icon-sm"
                      onClick={() => goToPage(page)}
                      aria-current={page === query.page ? "page" : undefined}
                      aria-label={`Page ${page}`}
                      className="hidden sm:inline-flex"
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(Math.min(totalPages, query.page + 1))}
                  disabled={query.page >= totalPages}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <BanUserDialog
        open={dialog?.type === "ban"}
        onOpenChange={(open) => !open && setDialog(null)}
        user={target}
      />
      <UnbanUserDialog
        open={dialog?.type === "unban"}
        onOpenChange={(open) => !open && setDialog(null)}
        user={target}
      />
      <DeleteUserDialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
        user={target}
      />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="rounded-full bg-muted p-2 text-muted-foreground">
        <Users className="size-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium">No users match these filters.</p>
      <p className="text-xs text-muted-foreground">
        {hasFilters
          ? "Try clearing the search or filters."
          : "New accounts will appear here."}
      </p>
      {hasFilters ? (
        <Button
          render={<Link href="/dashboard/user" />}
          variant="outline"
          size="sm"
          nativeButton={false}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
