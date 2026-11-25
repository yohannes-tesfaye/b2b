"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { HERO_SLIDES } from "@/lib/config/hero";

const ROTATE_MS = 5500;

/**
 * Slow crossfade carousel for the hero photo panel. Auto-rotation pauses on
 * hover/focus and is disabled entirely for reduced-motion users.
 */
export function HeroCarousel({ className }: { className?: string }) {
  const t = useTranslations("hero");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      className={cn(
        "relative min-h-[300px] overflow-hidden rounded-2xl bg-muted",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
            index === active ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.src}
            alt={t(slide.altKey)}
            fill
            sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 42vw, 100vw"
            className="object-cover"
            preload={index === 0}
          />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay/85 via-overlay/15 to-transparent"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <span className="type-caption inline-flex items-center gap-2 rounded-full bg-warm-soft/95 px-3 py-1.5 text-warm-foreground shadow-sm backdrop-blur">
          <span className="size-1.5 rounded-full bg-warm" aria-hidden />
          {t("imageBadge")}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <p className="font-heading text-lg font-semibold tracking-[-0.02em] text-[var(--cream-50)]">
          {t(HERO_SLIDES[active].labelKey)}
        </p>

        <div className="flex items-center gap-1.5">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${t("carouselLabel")} — ${t(slide.labelKey)}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                index === active
                  ? "w-7 bg-warm"
                  : "w-1.5 bg-[var(--cream-50)] opacity-60 hover:opacity-90"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
