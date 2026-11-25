import type { ComponentType, SVGProps } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import * as FlagComponents from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { SUPPLIER_REGIONS } from "@/lib/config/suppliers";

const flagComponents = FlagComponents as unknown as Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>;

function RegionFlag({ code, className }: { code: string; className?: string }) {
  const normalized = code.trim().toUpperCase();
  const sizeClass = className ?? "h-5 w-7";

  if (!hasFlag(normalized)) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-[10px] font-semibold text-muted-foreground",
          sizeClass
        )}
        aria-label={normalized}
      >
        {normalized}
      </span>
    );
  }

  const Flag = flagComponents[normalized];
  if (!Flag) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-[10px] font-semibold text-muted-foreground",
          sizeClass
        )}
        aria-label={normalized}
      >
        {normalized}
      </span>
    );
  }

  return (
    <Flag
      className={cn("shrink-0 rounded-sm border border-border object-cover", sizeClass)}
      aria-hidden
      focusable="false"
    />
  );
}

/**
 * Bento of supplier regions. Region data lives in lib/config/suppliers.ts.
 */
export default function SuppliersByRegion() {
  return (
    <section className="container-wide py-(--section-space)">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="type-caption text-brand">Suppliers</p>
          <h2 className="type-section mt-2">Suppliers by region</h2>
        </div>
        <Link
          href="/suppliers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Browse all regions
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="mt-(--spacing-12) grid gap-4 md:grid-cols-2 lg:auto-rows-[132px] lg:grid-cols-4">
        {SUPPLIER_REGIONS.map((region, index) => (
          <Link
            key={region.slug}
            href={`/suppliers/${region.slug}`}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40 hover:bg-muted/40",
              index === 0 && "md:col-span-2 md:row-span-2"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              {index === 0 ? (
                <span className="type-caption text-brand">Home market</span>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <RegionFlag
                code={region.countryCode}
                className={index === 0 ? "h-8 w-12" : "h-5 w-7"}
              />
              <h3
                className={cn(
                  "font-heading font-semibold tracking-[-0.02em]",
                  index === 0 ? "type-subheading" : "text-base"
                )}
              >
                {region.name}
              </h3>
            </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {region.suppliers.toLocaleString()} verified suppliers ·{" "}
                {region.lots.toLocaleString()} live lots
              </p>
          </Link>
        ))}

        <Link
          href="/suppliers"
          className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center transition-colors hover:border-brand/40 hover:bg-muted/70"
        >
          <Briefcase className="size-5 text-brand" strokeWidth={1.75} />
          <span className="text-sm font-medium">Trade service providers</span>
          <ArrowRight
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </Link>
      </div>
    </section>
  );
}
