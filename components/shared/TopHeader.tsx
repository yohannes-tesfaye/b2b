import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/config/site";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

interface TopHeaderProps {
  variant?: "default" | "auth";
}

/**
 * Hairline utility bar above the main header. The parent layout hides it on
 * mobile for the public site.
 */
function TopHeader({ variant = "default" }: TopHeaderProps) {
  const t = useTranslations("topHeader");

  return (
    <div className="border-b border-border bg-background/60">
      <div className="container-wide flex h-10 items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-4">
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Phone className="size-3.5" strokeWidth={1.75} />
            {SITE.phone}
          </a>
          <span className="h-3 w-px bg-border" aria-hidden />
          <a
            href={SITE.emailHref}
            className="hidden items-center gap-1.5 transition-colors hover:text-foreground lg:inline-flex"
          >
            <Mail className="size-3.5" strokeWidth={1.75} />
            {SITE.email}
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeSwitcher />
            <span className="h-3 w-px bg-border" aria-hidden />
            <LanguageSwitcher
              size="sm"
              className="h-7 rounded-full border-transparent bg-transparent px-2 text-xs"
            />
            <span className="h-3 w-px bg-border" aria-hidden />
          </div>

          {variant === "auth" ? (
            <Button
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              render={<Link href="/contact" />}
              nativeButton={false}
            >
              {t("contactUs")}
            </Button>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {t("joinFree")}
              </Link>
              <span className="h-3 w-px bg-border" aria-hidden />
              <Link
                href="/contact"
                className="font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {t("contactUs")}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
