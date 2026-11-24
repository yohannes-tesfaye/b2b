import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { REVIEW_KEYS, REVIEW_RATINGS } from "@/lib/config/reviews";

/**
 * Customer reviews, restyled to the shared type scale and palette.
 */
export default function Reviews() {
  const t = useTranslations("home.reviews");

  return (
    <section className="container-wide py-(--section-space)">
      <div className="mx-auto max-w-3xl text-center">
        <p className="type-caption text-brand">{t("eyebrow")}</p>
        <h2 className="type-section mt-2">{t("title")}</h2>
        <p className="type-body mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-(--spacing-12) grid gap-6 md:grid-cols-3">
        {REVIEW_KEYS.map((key) => {
          const rating = REVIEW_RATINGS[key];
          return (
            <article
              key={key}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/10"
            >
              <div
                className="flex items-center gap-1"
                aria-label={`${rating} out of 5`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < rating
                        ? "fill-warm text-warm"
                        : "text-muted-foreground/40"
                    }`}
                    strokeWidth={1.75}
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
                &ldquo;{t(`items.${key}.text`)}&rdquo;
              </p>

              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {t(`items.${key}.name`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`items.${key}.company`)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
