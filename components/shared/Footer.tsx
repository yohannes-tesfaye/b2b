import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/config/site";
import { BrandMark } from "./header/BrandMark";
import { FooterColumns } from "./footer/FooterColumns";
import { NewsletterForm } from "./footer/NewsletterForm";

/**
 * Creamy light footer: newsletter band, brand/contact block, config-driven
 * link columns and a hairline legal bar.
 */
export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer id="footer" className="border-t border-border bg-card">
      <div className="container-wide">
        {/* Newsletter */}
        <section className="grid gap-8 border-b border-border py-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16 lg:py-16">
          <div>
            <p className="type-caption text-brand">{t("newsletter.eyebrow")}</p>
            <h2 className="type-section mt-3 max-w-xl">
              {t("newsletter.title")}
            </h2>
            <p className="type-body mt-3 max-w-lg text-muted-foreground">
              {t("newsletter.description")}
            </p>
          </div>
          <div className="w-full lg:max-w-md lg:justify-self-end">
            <NewsletterForm />
          </div>
        </section>

        {/* Brand + links */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.15fr_2fr] lg:gap-16 lg:py-14">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("brandDescription")}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-muted-foreground" strokeWidth={1.75} />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-muted-foreground" strokeWidth={1.75} />
                {SITE.email}
              </a>
            </div>
          </div>

          <FooterColumns />
        </div>

        {/* Legal bar */}
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" strokeWidth={1.75} />
            {t("location")}
          </p>
        </div>
      </div>
    </footer>
  );
}
