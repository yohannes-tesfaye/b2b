import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FOOTER_COLUMNS } from "@/lib/config/footer";

/**
 * Footer link columns, driven by lib/config/footer.ts.
 */
export function FooterColumns() {
  const t = useTranslations("footer");

  return (
    <nav
      aria-label={t("linksLabel")}
      className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-10"
    >
      {FOOTER_COLUMNS.map((column) => (
        <div key={column.titleKey}>
          <h3 className="type-caption text-muted-foreground">
            {t(column.titleKey)}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {column.links.map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className="text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
