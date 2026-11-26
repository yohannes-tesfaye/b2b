import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { isOnboardingComplete } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";

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

  let unreadCount = 0;
  if (session?.user?.id) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
      },
      select: { buyerId: true, sellerId: true, buyerUnread: true, sellerUnread: true },
    });
    unreadCount = conversations.reduce((total, conversation) => {
      if (conversation.buyerId === session.user.id) total += conversation.buyerUnread;
      if (conversation.sellerId === session.user.id) total += conversation.sellerUnread;
      return total;
    }, 0);
  }

  return (
    <>
      {children}
      <MobileBottomNav signedIn={Boolean(session)} unreadCount={unreadCount} />
    </>
  );
}
