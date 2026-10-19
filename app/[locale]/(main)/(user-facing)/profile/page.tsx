import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import ProfileView from "@/components/profile/ProfileView";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({ href: "/log-in", locale: resolvedLocale });
    return null;
  }

  const user = session.user;

  return (
    <ProfileView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone,
        website: user.website,
        country: user.country,
        industry: user.industry,
        companySize: user.companySize,
        createdAt: user.createdAt,
      }}
    />
  );
}
