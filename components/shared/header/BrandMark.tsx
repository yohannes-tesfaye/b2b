import { Globe2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";

/**
 * Brand lockup shared by the desktop header, mobile app bar and mobile drawer.
 */
export function BrandMark({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("header");

  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={t("brand")}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
        <Globe2 className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="truncate font-heading text-[17px] font-semibold tracking-[-0.03em]">
          {t("brand")}
        </span>
        <span className="mt-1 truncate text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t("brandTagline")}
        </span>
      </span>
    </Link>
  );
}
