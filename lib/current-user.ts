import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const RETRY_DELAY_MS = 300;

/** Prisma/pg failures that mean the pooled connection dropped mid-request. */
function isConnectionError(error: unknown) {
  const value = error as {
    code?: string;
    message?: string;
    cause?: { code?: string; message?: string };
  };
  const codes = [value?.code, value?.cause?.code];
  if (codes.includes("P1001") || codes.includes("P1017")) return true;

  const message = `${value?.message ?? ""} ${value?.cause?.message ?? ""}`;
  return (
    message.includes("Server has closed the connection") ||
    message.includes("Can't reach database server")
  );
}

/**
 * Read the session, retrying once if the pooled database connection dropped.
 * Auth and validation errors are rethrown so they are never retried.
 */
async function getSessionWithRetry(requestHeaders: Headers) {
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch (error) {
    if (!isConnectionError(error)) throw error;

    console.warn(
      "[current-user] session lookup hit a dropped connection, retrying once"
    );
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return auth.api.getSession({ headers: requestHeaders });
  }
}

/**
 * Load the signed-in user from the database. Returns null for guests so pages
 * can redirect and server actions can return a friendly error.
 *
 * Wrapped in React cache so a layout and its page share one lookup per request.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSessionWithRetry(await headers()).catch(() => null);

  if (!session?.user?.id) return null;

  return prisma.user.findUnique({ where: { id: session.user.id } });
});
