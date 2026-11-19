import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRoles, roles } from "@/lib/permissions";
import { getSiteUrl } from "@/lib/site-url";

export const authClient = createAuthClient({
  // Use the current browser origin so auth works on any dev port; the env
  // value remains the SSR/deployment fallback.
  baseURL: typeof window === "undefined" ? getSiteUrl() : window.location.origin,
  plugins: [
    adminClient({
      ac,
      roles,
      adminRoles,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
