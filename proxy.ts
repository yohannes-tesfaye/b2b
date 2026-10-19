import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Auth pages a logged-in user should never see. `onboarding` and
// `reset-password` stay reachable: the former is part of the post-signup
// flow, the latter may be opened from a reset link while already signed in.
const GUEST_ONLY_SEGMENTS = [
  "log-in",
  "sign-up",
  "forgot-password",
  "onboarding",
  "reset-password",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const withoutLocale = pathname.replace(
    new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`),
    "",
  );
  const segment = withoutLocale.split("/")[1];

  if (GUEST_ONLY_SEGMENTS.includes(segment) && getSessionCookie(request)) {
    const locale = request.nextUrl.pathname.split("/").filter(Boolean)[0];
    const base = routing.locales.includes(
      locale as (typeof routing.locales)[number],
    )
      ? locale
      : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${base}`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
