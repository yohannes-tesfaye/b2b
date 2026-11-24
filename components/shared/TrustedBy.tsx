import { useTranslations } from "next-intl";
import { TRUSTED_COMPANIES } from "@/lib/config/trusted";

/**
 * Trust marquee. Company data lives in lib/config/trusted.ts.
 */
export default function TrustedBy() {
  const t = useTranslations("home.trusted");
  const loop = [...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES];

  return (
    <div className="w-full bg-muted py-(--section-space)">
      <div className="container-wide">
        <p className="type-caption text-brand">{t("eyebrow")}</p>
        <h2 className="type-section mt-2 text-center">{t("title")}</h2>
        <p className="type-body mt-3 text-center text-muted-foreground">
          {t("description")}
        </p>

        <div className="relative mt-(--spacing-12) overflow-hidden">
          <div className="flex w-max gap-4 animate-marquee">
            {loop.map((company, index) => {
              const Icon = company.icon;
              return (
                <div
                  key={`${company.name}-${index}`}
                  aria-hidden={index >= TRUSTED_COMPANIES.length}
                  className="group flex min-w-[13rem] items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors"
                >
                  <Icon
                    className="size-5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-foreground">
                    {company.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
