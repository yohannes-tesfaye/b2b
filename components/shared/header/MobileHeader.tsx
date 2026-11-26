"use client";

import { useState } from "react";
import { ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "@/i18n/navigation";
import { MOBILE_NAV_LINKS } from "@/lib/config/navigation";
import { SITE } from "@/lib/config/site";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import UserMenu from "@/components/Auth/UserMenu";
import { BrandMark } from "./BrandMark";
import { SearchBar } from "./SearchBar";
import { SellButton } from "./SellButton";

/**
 * Mobile app bar + drawer. Reuses the same nav config and search as desktop.
 */
export function MobileHeader() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <div className="container-wide flex h-16 items-center gap-1">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="h-11 w-11 rounded-full"
                aria-label={t("openMenu")}
              />
            }
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader className="flex flex-row items-center justify-between pb-2">
              <DrawerTitle className="sr-only">{t("brand")}</DrawerTitle>
              <BrandMark onNavigate={close} />
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="h-11 w-11 rounded-full"
                    aria-label={t("closeMenu")}
                  />
                }
              >
                <X className="size-4" />
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <nav className="space-y-0.5">
                {MOBILE_NAV_LINKS.filter(
                  (item) =>
                    item.labelKey !== "nav.home" &&
                    item.labelKey !== "nav.allProducts"
                ).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      onClick={close}
                      className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-muted/70"
                    >
                      <Icon
                        className="size-[18px] text-muted-foreground"
                        strokeWidth={1.75}
                      />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      <ChevronRight className="size-4 text-muted-foreground/60" />
                    </Link>
                  );
                })}
              </nav>

              <div className="my-4 h-px bg-border" />

              <p className="type-caption px-3 pb-2 text-muted-foreground">
                {t("support")}
              </p>
              <a
                href={SITE.phoneHref}
                className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-muted/70"
              >
                <Phone className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-muted/70"
              >
                <Mail className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
                {SITE.email}
              </a>

              <div className="my-4 h-px bg-border" />

              <div className="flex items-center justify-between gap-3 px-3 py-1">
                <span className="text-sm font-medium">{t("language")}</span>
                <LanguageSwitcher
                  size="sm"
                  className="h-9 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-1">
                <span className="text-sm font-medium">{t("theme")}</span>
                <ThemeSwitcher />
              </div>
            </div>

            <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <SellButton fullWidth onNavigate={close} />
            </div>
          </DrawerContent>
        </Drawer>

        <BrandMark className="min-w-0" />

        <div className="ml-auto flex items-center gap-1">
          <UserMenu compact />
        </div>
      </div>

      <div className="container-wide pb-3">
        <SearchBar size="lg" />
      </div>
    </div>
  );
}
