"use client";

import { Check } from "lucide-react";
import { cn } from "cn";

/** One step node: clickable, filled check, ringed current, muted upcoming. */
export function StepNode({
  index,
  step,
  label,
  last,
  onSelect,
}: {
  index: number;
  step: number;
  label: string;
  last: boolean;
  onSelect?: (index: number) => void;
}) {
  const done = index < step;
  const current = index === step;

  return (
    <li className={cn("flex items-center", !last && "flex-1")}>
      <button
        type="button"
        onClick={() => onSelect?.(index)}
        aria-current={current ? "step" : undefined}
        aria-label={label}
        className={cn(
          "group flex cursor-pointer items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-warm/30",
          current && "cursor-default"
        )}
      >
        <span
          className={cn(
            "relative grid size-(--spacing-8) shrink-0 place-items-center rounded-full text-xs font-semibold transition-all duration-300 motion-reduce:transition-none",
            done && "bg-primary text-primary-foreground",
            current && "bg-card text-primary ring-2 ring-primary/30",
            !done &&
              !current &&
              "border border-border bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-primary",
            done && "group-hover:ring-2 group-hover:ring-primary/30"
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
            current ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {label}
        </span>
      </button>
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
