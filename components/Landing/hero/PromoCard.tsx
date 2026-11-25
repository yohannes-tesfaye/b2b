import Image from "next/image";
import { ArrowUpRight, BadgePercent, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PROMO_IMAGE } from "@/lib/config/hero";

/**
 * Deep-green wholesale promo. Quote requests go to /contact.
 */
export function PromoCard({ className }: { className?: string }) {
  const t = useTranslations("hero");
  const bullets = [
    t("promoBullet1"),
    t("promoBullet2"),
    t("promoBullet3"),
  ];

  return (
    <aside
      className={cn(
        "flex flex-col gap-5 overflow-hidden rounded-2xl bg-[var(--brand-600)] p-6 text-[var(--brand-contrast)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8 lg:p-7 xl:flex xl:flex-col xl:items-stretch",
        className
      )}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="type-caption opacity-70">{t("promoEyebrow")}</p>
            <h2 className="type-subheading mt-3 max-w-[17rem]">
              {t("promoTitle")}
            </h2>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warm-soft text-warm-foreground">
            <BadgePercent className="size-5" strokeWidth={1.75} />
          </span>
        </div>

        <p className="text-base leading-relaxed opacity-80">
          {t("promoDescription")}
        </p>

        <ul className="space-y-2.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 text-base">
              <Check className="size-4 shrink-0 text-warm" strokeWidth={2} />
              {bullet}
            </li>
          ))}
        </ul>

        <Button
          className="group h-12 w-full rounded-full bg-[var(--brand-contrast)] px-5 text-base font-semibold text-[var(--brand-600)] hover:bg-[var(--cream-200)]"
          render={<Link href="/contact" />}
          nativeButton={false}
        >
          {t("promoCta")}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Button>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--brand-500)] lg:aspect-[4/3] xl:aspect-[4/3]">
        <Image
          src={PROMO_IMAGE.src}
          alt={t(PROMO_IMAGE.altKey)}
          fill
          sizes="(min-width: 1280px) 16rem, (min-width: 1024px) 34vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-overlay/70 via-transparent to-transparent"
          aria-hidden
        />
        <span className="type-caption absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-warm-soft/95 px-3 py-1.5 text-warm-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-warm" aria-hidden />
          {t("promoBadge")}
        </span>
      </div>
    </aside>
  );
}
