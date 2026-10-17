import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRoles, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles,
      adminRoles,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
