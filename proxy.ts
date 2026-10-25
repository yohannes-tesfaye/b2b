import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Auth pages a logged-in user should never see. `onboarding` is intentionally
// absent: it is part of the post-signup flow, and the (main) layout bounces
// users back to it until their profile is complete.
const GUEST_ONLY_SEGMENTS = [
  "log-in",
  "sign-up",
  "forgot-password",
  "reset-password",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Expose the request pathname to server components (e.g. banned-user guard).
  request.headers.set("x-pathname", pathname);
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
