"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import { HEADER_NAV } from "@/lib/config/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const triggerClassName =
  "h-10 rounded-full px-3.5 text-[13px] font-medium text-foreground/75 hover:bg-muted/70 hover:text-foreground data-open:bg-muted/70";

/**
 * Desktop navigation. Entries come from lib/config/navigation.ts, so adding a
 * destination is a one-line change.
 */
export function HeaderNav() {
  const t = useTranslations("header");

  return (
    <NavigationMenu className="max-w-none justify-start">
      <NavigationMenuList className="justify-start gap-1">
        {HEADER_NAV.map((entry) => {
          if (entry.items) {
            return (
              <NavigationMenuItem key={entry.labelKey}>
                <NavigationMenuTrigger
                  className={cn(navigationMenuTriggerStyle(), triggerClassName)}
                >
                  {t(entry.labelKey)}
                </NavigationMenuTrigger>

                <NavigationMenuContent className="w-[min(92vw,36rem)] p-2">
                  <div className="grid gap-1 sm:grid-cols-2">
                    {entry.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavigationMenuLink
                          key={item.labelKey}
                          className="group/link items-start gap-3 rounded-xl p-3 hover:bg-muted/70"
                          render={<Link href={item.href} />}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-brand">
                            <Icon className="size-4" strokeWidth={1.75} />
                          </span>
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                              {t(item.labelKey)}
                              <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
                            </span>
                            {item.descriptionKey ? (
                              <span className="text-xs leading-relaxed text-muted-foreground">
                                {t(item.descriptionKey)}
                              </span>
                            ) : null}
                          </span>
                        </NavigationMenuLink>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-3 border-t border-border px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-brand" />
                      {t("verifiedSuppliers")}
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      {t("nav.browseAll")}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          const Icon = entry.icon;
          return (
            <NavigationMenuItem key={entry.labelKey}>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), triggerClassName)}
                render={<Link href={entry.href ?? "/"} />}
              >
                {Icon ? (
                  <Icon
                    className="mr-1.5 size-3.5 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                ) : null}
                {t(entry.labelKey)}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
