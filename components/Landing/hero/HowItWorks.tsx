import { FileText, Search, Ship, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HeroMessageKey } from "@/lib/config/hero";

const STEPS = [
  {
    titleKey: "step1Title",
    descriptionKey: "step1Description",
    icon: Search,
  },
  {
    titleKey: "step2Title",
    descriptionKey: "step2Description",
    icon: FileText,
  },
  {
    titleKey: "step3Title",
    descriptionKey: "step3Description",
    icon: Ship,
  },
] satisfies ReadonlyArray<{
  titleKey: HeroMessageKey;
  descriptionKey: HeroMessageKey;
  icon: LucideIcon;
}>;

/**
 * Three-step trade flow. Anchored by the header/footer "How it works" links.
 */
export function HowItWorks() {
  const t = useTranslations("hero");

  return (
    <section
      id="how-it-works"
      className="scroll-mt-36 py-(--section-space)"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
        <div className="lg:w-56 lg:shrink-0 lg:pt-1">
          <p className="type-caption text-brand">{t("howEyebrow")}</p>
          <h2 className="type-subheading mt-2 max-w-[14rem]">
            {t("howTitle")}
          </h2>
        </div>

        <ol className="grid flex-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.titleKey} className="flex flex-col bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <Icon className="size-4 text-brand" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-sm font-semibold">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(step.descriptionKey)}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
