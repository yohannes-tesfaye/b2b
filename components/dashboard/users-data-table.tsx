"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initialsFrom } from "@/lib/profile";
import type { UserRow } from "./user-list";
import { banUser, unbanUser, deleteUser } from "@/app/[locale]/(main)/(dashboard)/users/actions";

interface Props {
  users: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
  role: string;
  status: string;
  sort: string;
  dir: "asc" | "desc";
}

function StatusCell({ user }: { user: UserRow }) {
  const router = useRouter();
  const [reasonMode, setReasonMode] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUnban = () => {
    startTransition(async () => {
      await unbanUser(user.id);
      router.refresh();
    });
  };
  const handleBan = () => {
    startTransition(async () => {
      await banUser(user.id, reason || "Banned by admin");
      setReasonMode(false);
      setReason("");
      router.refresh();
    });
  };

  if (reasonMode) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ban reason"
          className="h-7 w-32 text-xs"
          autoFocus
        />
        <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={handleBan} disabled={isPending}>
          Ban
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setReasonMode(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className="border-0 bg-transparent p-0 shadow-none">
            {user.banned ? (
              <Badge variant="destructive" className="cursor-pointer">Banned</Badge>
            ) : (
              <Badge variant="outline" className="cursor-pointer">Active</Badge>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuItem
          disabled={!user.banned || isPending}
          onClick={handleUnban}
        >
          Mark active
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={Boolean(user.banned) || isPending}
          onClick={() => setReasonMode(true)}
        >
          Mark banned
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UsersDataTable({ users, total, page, pageSize, q, role, status, sort, dir }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [localQ, setLocalQ] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setLocalQ(q), [q]);

  const update = (patch: Record<string, string>) => {
    const next = {
      page: String(page),
      pageSize: String(pageSize),
      q: localQ,
      role,
      status,
      sort,
      dir,
      ...patch,
    };
    const params = new URLSearchParams();
    if (next.page && next.page !== "1") params.set("page", next.page);
    if (next.pageSize && next.pageSize !== "10") params.set("pageSize", next.pageSize);
    if (next.q) params.set("q", next.q);
    if (next.role && next.role !== "all") params.set("role", next.role);
    if (next.status && next.status !== "all") params.set("status", next.status);
    if (next.sort && next.sort !== "createdAt") params.set("sort", next.sort);
    if (next.dir && next.dir !== "desc") params.set("dir", next.dir);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localQ !== q) update({ q: localQ, page: "1" });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const handleSort = (column: string) => {
    if (sort === column) {
      update({ dir: dir === "asc" ? "desc" : "asc", page: "1" });
    } else {
      update({ sort: column, dir: "asc", page: "1" });
    }
  };

  const handleDelete = (u: UserRow) => {
    if (!window.confirm(`Delete ${u.name || u.email}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteUser(u.id);
      router.refresh();
    });
  };

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {u.image ? <AvatarImage src={u.image} alt={u.name} /> : null}
              <AvatarFallback className="text-xs">{initialsFrom(u.name || u.email)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link href={`/users/${u.id}`} className="font-medium hover:underline truncate block">
                {u.name || "Unnamed"}
              </Link>
              <div className="text-xs text-muted-foreground truncate">{u.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{row.original.role || "buyer"}</Badge>,
    },
    {
      accessorKey: "banned",
      header: "Status",
      cell: ({ row }) => <StatusCell user={row.original} />,
    },
    { accessorKey: "companyName", header: "Company", cell: ({ row }) => row.original.companyName || "—" },
    { accessorKey: "country", header: "Country", cell: ({ row }) => row.original.country || "—" },
    { accessorKey: "industry", header: "Industry", cell: ({ row }) => row.original.industry || "—" },
    { accessorKey: "companySize", header: "Size", cell: ({ row }) => row.original.companySize || "—" },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button render={<Link href={`/users/${u.id}`} />} size="sm" variant="ghost" nativeButton={false}>
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => handleDelete(u)}
              disabled={isPending}
            >
              Delete
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / pageSize) || 1,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting: sort ? [{ id: sort, desc: dir === "desc" }] : [],
    },
  });

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search users..."
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={(v) => v && update({ role: v, page: "1" })}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => v && update({ status: v, page: "1" })}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(pageSize)} onValueChange={(v) => v && update({ pageSize: v, page: "1" })}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    onClick={() => {
                      if (h.column.id === "actions" || h.column.id === "banned") return;
                      handleSort(h.column.id);
                    }}
                    className={h.column.id !== "actions" && h.column.id !== "banned" ? "cursor-pointer select-none" : ""}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {sort === h.column.id ? (dir === "asc" ? " ↑" : " ↓") : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((u) => (
                <TableRow key={u.id}>
                  {table.getRowModel().rows.find((r) => r.original.id === u.id)?.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )) ?? null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {total} user(s) total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ page: String(Math.max(1, page - 1)) })}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ page: String(Math.min(totalPages, page + 1)) })}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
