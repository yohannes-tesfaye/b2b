import { ArrowRight, Briefcase } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { SUPPLIER_REGIONS } from "@/lib/config/suppliers";

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
              <span
                className={cn(
                  "leading-none",
                  index === 0 ? "text-6xl" : "text-3xl"
                )}
                aria-hidden
              >
                {region.flag}
              </span>
              {index === 0 ? (
                <span className="type-caption text-brand">Home market</span>
              ) : null}
            </div>

            <div>
              <h3
                className={cn(
                  "font-heading font-semibold tracking-[-0.02em]",
                  index === 0 ? "type-subheading" : "text-base"
                )}
              >
                {region.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {region.suppliers.toLocaleString()} verified suppliers ·{" "}
                {region.lots.toLocaleString()} live lots
              </p>
            </div>
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
