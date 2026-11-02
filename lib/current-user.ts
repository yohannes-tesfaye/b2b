import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Load the signed-in user from the database. Returns null for guests so pages
 * can redirect and server actions can return a friendly error.
 *
 * Wrapped in React cache so a layout and its page share one lookup per request.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user?.id) return null;

  return prisma.user.findUnique({ where: { id: session.user.id } });
});
