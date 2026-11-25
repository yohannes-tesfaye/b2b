"use client";

import { Check } from "lucide-react";
import { cn } from "cn";

/** One step node: filled check, ringed current, muted upcoming, fill line. */
export function StepNode({
  index,
  step,
  label,
  last,
}: {
  index: number;
  step: number;
  label: string;
  last: boolean;
}) {
  const done = index < step;
  const current = index === step;

  return (
    <li className={cn("flex items-center", !last && "flex-1")}>
      <span
        aria-current={current ? "step" : undefined}
        className={cn(
          "relative grid size-(--spacing-8) shrink-0 place-items-center rounded-full text-xs font-semibold transition-all duration-300 motion-reduce:transition-none",
          done && "bg-primary text-primary-foreground",
          current && "bg-card text-primary ring-2 ring-primary/30",
          !done && !current && "border border-border bg-card text-muted-foreground"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 transition-opacity duration-300 motion-reduce:transition-none",
            done ? "opacity-0" : "opacity-100"
          )}
        >
          {index + 1}
        </span>
        <Check
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 size-(--spacing-4) transition-transform duration-300 motion-reduce:transition-none",
            done ? "scale-100" : "scale-0"
          )}
        />
      </span>
      <span
        className={cn(
          "ml-(--spacing-2) hidden text-xs font-medium transition-colors sm:inline",
          current ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      {last ? null : (
        <span
          aria-hidden
          className="mx-(--spacing-2) h-px flex-1 overflow-hidden bg-border sm:mx-(--spacing-3)"
        >
          <span
            className={cn(
              "block h-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none",
              done ? "w-full" : "w-0"
            )}
          />
        </span>
      )}
    </li>
  );
}
