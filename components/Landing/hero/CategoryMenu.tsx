import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ALL_CATEGORIES, HERO_CATEGORIES } from "@/lib/config/categories";

/**
 * Category rail: vertical on desktop, horizontal scroll on mobile.
 * Every link points at a real /products category filter.
 */
export function CategoryMenu() {
  const t = useTranslations("hero");

  return (
    <nav
      aria-label={t("sidebarTitle")}
      className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-2 lg:flex lg:flex-col lg:p-3"
    >
      <p className="type-caption hidden px-3 pb-2 pt-1 text-muted-foreground lg:block">
        {t("sidebarTitle")}
      </p>

      <ul className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {HERO_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.labelKey} className="shrink-0 lg:shrink">
              <Link
                href={category.href}
                className="group flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-foreground/75 transition-colors hover:bg-muted/70 hover:text-foreground lg:h-auto lg:py-2.5"
              >
                <Icon
                  className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand"
                  strokeWidth={1.75}
                />
                <span className="whitespace-nowrap">{t(category.labelKey)}</span>
                <ChevronRight
                  className="ml-auto hidden size-3.5 text-muted-foreground/50 lg:block"
                  strokeWidth={1.75}
                />
              </Link>
            </li>
          );
        })}

        <li className="shrink-0 lg:mt-1 lg:border-t lg:border-border lg:pt-1">
          <Link
            href={ALL_CATEGORIES.href}
            className="group flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/70 lg:h-auto lg:py-2.5"
          >
            <ALL_CATEGORIES.icon
              className="size-4 shrink-0 text-brand"
              strokeWidth={1.75}
            />
            <span className="whitespace-nowrap">{t(ALL_CATEGORIES.labelKey)}</span>
            <ChevronRight
              className="ml-auto hidden size-3.5 text-muted-foreground/50 lg:block"
              strokeWidth={1.75}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
