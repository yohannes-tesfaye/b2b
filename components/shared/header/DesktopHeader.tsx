import { ArrowRight, Heart, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import UserMenu from "@/components/Auth/UserMenu";
import { useSession } from "@/lib/auth-client";
import { BrandMark } from "./BrandMark";
import { HeaderNav } from "./HeaderNav";
import { SearchBar } from "./SearchBar";
import { SellButton } from "./SellButton";

/**
 * Desktop header: brand + search + account on the first row,
 * navigation and utility controls on the hairline second row.
 */
export function DesktopHeader() {
  const t = useTranslations("header");
  const { data: session } = useSession();

  return (
    <div className="hidden lg:block">
      <div className="container-wide flex h-20 items-center gap-6">
        <BrandMark className="shrink-0" />

        <SearchBar className="mx-auto max-w-2xl" />

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {session ? (
            <Link
              href={`/${session.user.id}/dashboard/favorite`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>
          ) : null}
          <UserMenu />
          <SellButton />
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="container-wide flex h-12 items-center justify-between gap-4">
          <HeaderNav />

          <div className="flex shrink-0 items-center gap-1">
            <ThemeSwitcher />
            <span className="mx-1 h-4 w-px bg-border" aria-hidden />
            <LanguageSwitcher
              size="sm"
              className="h-9 rounded-full border-transparent bg-transparent px-2.5 text-xs hover:bg-muted/70"
            />
            <span
              className="mx-1 hidden h-4 w-px bg-border xl:block"
              aria-hidden
            />
            <Link
              href="/#regions"
              className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
            >
              <ShieldCheck className="size-3.5 text-brand" strokeWidth={1.75} />
              {t("verifiedSuppliers")}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
