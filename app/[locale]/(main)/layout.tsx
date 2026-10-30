import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { isOnboardingComplete } from "@/lib/profile";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (session && !isOnboardingComplete(session.user)) {
    redirect({ href: "/onboarding", locale: await getLocale() });
  }

  const banned = (session?.user as { banned?: boolean | null } | undefined)?.banned ?? false;
  const pathname = h.get("x-pathname") ?? "";
  const isAuthPath = pathname.includes("log-in") || pathname.includes("sign-up");
  if (session && banned && !isAuthPath) {
    redirect({ href: "/log-in?banned=1", locale: await getLocale() });
  }

  return children;
}
