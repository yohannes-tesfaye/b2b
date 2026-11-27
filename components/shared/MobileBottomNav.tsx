"use client";

import { Home, Inbox, LayoutGrid, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";
import UserMenu from "@/components/Auth/UserMenu";
import { PostListingTab } from "./PostListingTab";

type NavItem = {
  key: "home" | "products" | "messages";
  href: string;
  icon: LucideIcon;
  /** Prefix that should light the tab up. */
  match: string;
  exact?: boolean;
  badge?: number;
};

/**
 * Fixed bottom navigation for phones. Rendered from `(main)/layout.tsx` so it
 * covers the public site and the dashboard; hidden on the immersive chat
 * thread, where the composer sits at the bottom of the screen.
 */
export function MobileBottomNav({
  signedIn,
  unreadCount = 0,
}: {
  signedIn: boolean;
  unreadCount?: number;
}) {
  const t = useTranslations("header");
  const pathname = usePathname() || "";

  // A thread fills the viewport with its own sticky composer.
  if (/^\/dashboard\/messages\/[^/]+/.test(pathname)) return null;

  const loginHref = (next: string) =>
    `/log-in?next=${encodeURIComponent(next)}`;

  const items: NavItem[] = [
    { key: "home", href: "/", icon: Home, match: "/", exact: true },
    { key: "products", href: "/products", icon: LayoutGrid, match: "/products" },
    {
      key: "messages",
      href: signedIn ? "/dashboard/messages" : loginHref("/dashboard/messages"),
      icon: Inbox,
      match: "/dashboard/messages",
      badge: unreadCount,
    },
  ];

  return (
    <>
      {/* In-flow spacer so the fixed bar never covers the end of the page. */}
      <div
        className="h-[calc(4.75rem+env(safe-area-inset-bottom))] md:hidden"
        aria-hidden="true"
      />
      <nav
        aria-label={t("bottomNav.home")}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/85 md:hidden"
      >
        <ul className="grid grid-cols-5">
          {items.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.match
              : pathname === item.match || pathname.startsWith(`${item.match}/`);

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative">
                    <Icon className="size-[22px]" strokeWidth={active ? 2.1 : 1.75} />
                    {item.badge ? (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate px-1">{t(`bottomNav.${item.key}`)}</span>
                  {active ? (
                    <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              </li>
            );
          })}
          <li>
            <PostListingTab />
          </li>
          {items.slice(2).map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.match
              : pathname === item.match || pathname.startsWith(`${item.match}/`);

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative">
                    <Icon className="size-[22px]" strokeWidth={active ? 2.1 : 1.75} />
                    {item.badge ? (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate px-1">{t(`bottomNav.${item.key}`)}</span>
                  {active ? (
                    <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              </li>
            );
          })}
          <li>
            <UserMenu
              variant="tab"
              active={
                pathname === "/dashboard" ||
                (pathname.startsWith("/dashboard/") &&
                  !pathname.startsWith("/dashboard/messages"))
              }
              unreadCount={unreadCount}
            />
          </li>
        </ul>
      </nav>
    </>
  );
}
