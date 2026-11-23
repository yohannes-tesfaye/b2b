"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(listingId: string): Promise<{ isFavorited: boolean }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_listingId: { userId: user.id, listingId } },
    });
    revalidatePath("/[locale]/[userId]/dashboard/favorite", "page");
    return { isFavorited: false };
  }

  await prisma.favorite.create({
    data: { userId: user.id, listingId },
  });
  revalidatePath("/[locale]/[userId]/dashboard/favorite", "page");
  return { isFavorited: true };
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { listingId: true },
  });
  return favorites.map((f) => f.listingId);
}

export async function isFavorited(userId: string, listingId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });
  return !!favorite;
}
