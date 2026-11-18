"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

export function ProductGallery({
  images,
  title,
  typeLabel,
  isWanted,
}: {
  images: string[];
  title: string;
  typeLabel?: string;
  isWanted?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!images.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-muted text-sm text-muted-foreground lg:aspect-[4/3] lg:rounded-2xl lg:border">
        No image available
      </div>
    );
  }

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndex(i);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((current) => (current === i ? current : i));
  };

  return (
    <div className="lg:flex lg:gap-3">
      {/* Desktop: vertical thumbnail rail, Amazon-style */}
      {images.length > 1 ? (
        <div className="hidden w-20 shrink-0 flex-col gap-2 overflow-y-auto scrollbar-none lg:flex">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border bg-muted transition-all",
                i === index
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-75 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Main slider — swipe on phones, arrows everywhere */}
      <div className="relative min-w-0 flex-1 overflow-hidden bg-muted lg:rounded-2xl lg:border">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square w-full shrink-0 snap-center sm:aspect-[4/3]"
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                unoptimized
                loading={i === 0 ? "eager" : undefined}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {typeLabel ? (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm lg:left-4 lg:top-4",
              isWanted ? "bg-blue-600" : "bg-emerald-600"
            )}
          >
            {typeLabel}
          </span>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent lg:hidden" />

        {images.length > 1 ? (
          <>
            {/* Image counter */}
            <span className="absolute bottom-6 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur lg:bottom-4">
              {index + 1} / {images.length}
            </span>

            {/* Mobile dots */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 lg:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous image"
              onClick={() => scrollTo(Math.max(index - 1, 0))}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow backdrop-blur transition-opacity disabled:opacity-40 lg:left-3"
              disabled={index === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => scrollTo(Math.min(index + 1, images.length - 1))}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow backdrop-blur transition-opacity disabled:opacity-40 lg:right-3"
              disabled={index === images.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
