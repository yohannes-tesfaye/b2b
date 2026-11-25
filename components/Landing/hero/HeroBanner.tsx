import Image from "next/image";
import {
  ArrowUpRight,
  BadgePercent,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SUPPLY_THUMBNAILS } from "@/lib/config/hero";
import { HeroCarousel } from "./HeroCarousel";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="type-caption text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </dd>
    </div>
  );
}

/**
 * Editorial hero: headline and real marketplace CTAs on the left, a rotating
 * photo panel of Ethiopian export goods on the right, and a live supply board
 * with product thumbnails underneath.
 */
export function HeroBanner() {
  const t = useTranslations("hero");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 lg:p-8">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="type-caption text-brand">{t("eyebrow")}</p>
            <h1 className="type-hero mt-4 max-w-2xl">{t("title")}</h1>
            <p className="type-body mt-5 max-w-xl text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                className="group h-12 rounded-full px-6 text-base font-semibold"
                render={<Link href="/products?type=available" />}
                nativeButton={false}
              >
                {t("primaryCta")}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-border bg-transparent px-6 text-base font-medium hover:bg-muted/70"
                render={<Link href="/products?type=wanted" />}
                nativeButton={false}
              >
                {t("secondaryCta")}
              </Button>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="size-4 text-brand"
                  strokeWidth={1.75}
                />
                {t("trustVerified")}
              </li>
              <li className="inline-flex items-center gap-2">
                <BadgePercent
                  className="size-4 text-brand"
                  strokeWidth={1.75}
                />
                {t("trustBulk")}
              </li>
              <li className="inline-flex items-center gap-2">
                <Handshake className="size-4 text-brand" strokeWidth={1.75} />
                {t("trustSecure")}
              </li>
            </ul>
          </div>
        </div>

        <HeroCarousel className="h-full min-h-[320px] lg:min-h-[460px]" />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="type-caption text-muted-foreground">
            {t("boardTitle")}
          </p>
          <span className="type-caption inline-flex items-center gap-1.5 text-warm">
            <span className="size-1.5 rounded-full bg-warm" aria-hidden />
            {t("stats.live")}
          </span>
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat
              value={t("stats.suppliersValue")}
              label={t("stats.suppliersLabel")}
            />
            <Stat
              value={t("stats.lotsValue")}
              label={t("stats.lotsLabel")}
            />
            <Stat
              value={t("stats.responseValue")}
              label={t("stats.responseLabel")}
            />
          </dl>

          <ul
            aria-label={t("supplyThumbsLabel")}
            className="flex items-center gap-2 lg:justify-end"
          >
            {SUPPLY_THUMBNAILS.map((thumbnail) => (
              <li key={thumbnail.src}>
                <div className="relative size-12 overflow-hidden rounded-xl border border-border bg-muted sm:size-14">
                  <Image
                    src={thumbnail.src}
                    alt={t(thumbnail.altKey)}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">
            {t("stats.coverageLabel")}
          </span>
          <span className="text-right font-medium">
            {t("stats.coverageValue")}
          </span>
        </div>
      </div>
    </div>
  );
}
