import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { prisma } from "@/lib/prisma";
import { ac, adminRoles, roles } from "@/lib/permissions";
import { getSiteOrigin, getSiteUrl } from "@/lib/site-url";

const socialProviders: NonNullable<
  BetterAuthOptions["socialProviders"]
> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  socialProviders.facebook = {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  };
}

if (process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET) {
  socialProviders.tiktok = {
    clientKey: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  appName: "GlobalTradeHUB",
  // Explicit baseURL so a stale BETTER_AUTH_URL in the environment can never
  // override the real deployment URL (e.g. localhost leaking into prod).
  baseURL: getSiteUrl(),
  trustedOrigins: [
    getSiteOrigin(),
    // Keep localhost trusted during development (e.g. hitting the API
    // from a non-standard port).
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000"]
      : []),
  ],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO: send this through an email provider (e.g. Resend)
      console.log(`Password reset for ${user.email}: ${url}`);
    },
  },
  socialProviders,
  user: {
    additionalFields: {
      companyName: { type: "string", required: false },
      phone: { type: "string", required: false },
      website: { type: "string", required: false },
      country: { type: "string", required: false },
      industry: { type: "string", required: false },
      companySize: { type: "string", required: false },
    },
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    admin({
      ac,
      roles,
      adminRoles,
      defaultRole: "buyer",
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
