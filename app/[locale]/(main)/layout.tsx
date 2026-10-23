import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { isOnboardingComplete } from "@/lib/profile";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !isOnboardingComplete(session.user)) {
    redirect({ href: "/onboarding", locale: await getLocale() });
  }

  return children;
}
