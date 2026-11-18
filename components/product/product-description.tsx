"use client";

import { useState } from "react";
import { cn } from "cn";

export function ProductDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={cn(
          "whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
          !expanded && "line-clamp-4 lg:line-clamp-none"
        )}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 inline-flex min-h-10 items-center text-sm font-semibold text-primary active:opacity-70 lg:hidden"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
