"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/permissions";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string | null } | undefined)?.role ?? null;
  if (!session || !role || !adminRoles.includes(role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function banUser(userId: string, reason: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) throw new Error("Cannot ban yourself");
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { banned: true, banReason: reason || "Banned by admin" },
    }),
    prisma.session.deleteMany({ where: { userId } }),
  ]);
  revalidatePath("/[locale]/users", "page");
  revalidatePath("/[locale]/users/[id]", "page");
}

export async function unbanUser(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) throw new Error("Cannot unban yourself");
  await prisma.user.update({
    where: { id: userId },
    data: { banned: false, banReason: null },
  });
  revalidatePath("/[locale]/users", "page");
  revalidatePath("/[locale]/users/[id]", "page");
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) throw new Error("Cannot delete yourself");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/[locale]/users", "page");
}
