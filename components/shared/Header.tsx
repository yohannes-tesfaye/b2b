"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Globe,
  Home,
  Mail,
  Menu,
  Package,
  Phone,
  PlusCircle,
  Search,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "@/components/Auth/UserMenu";
import { useSession } from "@/lib/auth-client";
import {
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const t = useTranslations("header");
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b bg-background lg:border-0 lg:bg-transparent">
      {/* Mobile app bar */}
      <div className="flex items-center gap-1 px-3 py-2 lg:hidden">
        <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
          <DrawerTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="h-10 w-10 rounded-xl"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </span>
                <div>
                  <DrawerTitle className="text-[15px] leading-tight">
                    {t("brand")}
                  </DrawerTitle>
                  <p className="text-[11px] text-muted-foreground">
                    B2B marketplace
                  </p>
                </div>
              </div>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="h-10 w-10 rounded-full"
                    aria-label="Close menu"
                  />
                }
              >
                <ChevronRight className="h-4 w-4 rotate-90" />
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <nav className="space-y-1">
                <MobileNavLink
                  href="/"
                  icon={<Home className="h-[18px] w-[18px]" />}
                  label="Home"
                  onNavigate={closeMenu}
                />
                <MobileNavLink
                  href="/products"
                  icon={<Package className="h-[18px] w-[18px]" />}
                  label="Products"
                  onNavigate={closeMenu}
                />
                <MobileNavLink
                  href={
                    session
                      ? `/${session.user.id}/dashboard/listings/new`
                      : "/sign-up"
                  }
                  icon={<Store className="h-[18px] w-[18px]" />}
                  label={t("sellOnHub")}
                  onNavigate={closeMenu}
                />
              </nav>

              <div className="my-3 h-px bg-border" />

              <div className="space-y-1">
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Support
                </p>
                <a
                  href="tel:+251901964187"
                  className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium active:bg-muted"
                >
                  <Phone className="h-[18px] w-[18px] text-muted-foreground" />
                  +251 901 964 187
                </a>
                <a
                  href="mailto:Hello@abc.com"
                  className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium active:bg-muted"
                >
                  <Mail className="h-[18px] w-[18px] text-muted-foreground" />
                  Hello@abc.com
                </a>
              </div>

              <div className="my-3 h-px bg-border" />

              <div className="flex items-center justify-between gap-3 px-3 py-1">
                <span className="text-sm font-medium">Language</span>
                <LanguageSwitcher size="default" className="h-10" />
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-1">
                <span className="text-sm font-medium">{t("theme")}</span>
                <ThemeSwitcher />
              </div>
            </div>

            <div className="border-t bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button
                className="h-12 w-full rounded-xl text-sm font-semibold"
                render={
                  <Link
                    href={
                      session
                        ? `/${session.user.id}/dashboard/listings/new`
                        : "/sign-up"
                    }
                    onClick={closeMenu}
                  />
                }
                nativeButton={false}
              >
                <PlusCircle className="h-4 w-4" />
                {t("postListing")}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <Link
          href="/"
          className="flex min-h-10 min-w-0 items-center gap-1.5 px-1 active:opacity-70"
        >
          <Globe className="h-5 w-5 shrink-0 text-primary" />
          <span className="truncate text-[17px] font-bold tracking-tight">
            {t("brand")}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-lg"
            className="h-10 w-10 rounded-xl"
            aria-label="Search products"
            onClick={() => {
              document.getElementById("mobile-search")?.focus();
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
          <UserMenu compact />
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submitSearch} className="px-3 pb-3 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="mobile-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, suppliers, locations..."
            className="h-11 rounded-xl border-border/70 bg-muted/50 pl-9 pr-20 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1.5 top-1/2 h-10 -translate-y-1/2 rounded-lg px-3"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="flex w-[90%] flex-col justify-between py-5 lg:w-[90%] lg:flex-row m-auto">
          <div className="mb-4 flex w-max items-center gap-3 lg:m-0">
            <Globe />
            <Link
              href="/"
              className="text-2xl font-bold transition-opacity hover:opacity-80 md:text-2xl"
            >
              {t("brand")}
            </Link>
          </div>
          <form
            onSubmit={submitSearch}
            className="mb-4 flex items-center gap-2 lg:m-0 lg:w-max"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex flex-1 md:min-w-[400px]"
            />
            <Button variant="outline" type="submit">
              {t("search")}
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <UserMenu />
            <Button
              render={
                <Link
                  href={
                    session
                      ? `/${session.user.id}/dashboard/listings/new`
                      : "/sign-up"
                  }
                />
              }
              nativeButton={false}
            >
              {t("postListing")}
            </Button>
          </div>
        </div>
        <hr className="m-auto mb-1 w-[90%]" />
        <div className="m-auto flex w-[90%] items-center justify-between">
          <nav className="flex items-center gap-1">
            <DesktopNavLink href="/" label="Home" />
            <DesktopNavLink href="/products" label="Products" />
          </nav>

          <div className="flex items-center gap-2 text-[14px]">
            <Link
              href="/sign-up"
              className="rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-muted"
            >
              {t("sellOnHub")}
            </Link>
          </div>
        </div>
        <hr className="m-auto mt-1 w-[90%]" />
      </div>
    </header>
  );
};

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-active:text-foreground"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium active:bg-muted"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
    </Link>
  );
}


export default Header;
