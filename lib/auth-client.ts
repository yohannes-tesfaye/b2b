import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRoles, roles } from "@/lib/permissions";
import { getSiteUrl } from "@/lib/site-url";

export const authClient = createAuthClient({
  // Inlined at build time (NEXT_PUBLIC_*); matches the server config in
  // lib/auth.ts so the client never picks up a stale BETTER_AUTH_URL.
  baseURL: getSiteUrl(),
  plugins: [
    adminClient({
      ac,
      roles,
      adminRoles,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
