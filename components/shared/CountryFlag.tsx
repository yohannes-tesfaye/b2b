"use client";

import type { ComponentType, SVGProps } from "react";
import * as FlagComponents from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";

const flagComponents = FlagComponents as unknown as Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>;

export function CountryFlag({ code }: { code: string }) {
  const normalized = code.trim().toUpperCase();
  if (!hasFlag(normalized)) return null;
  const Flag = flagComponents[normalized];
  if (!Flag) return null;
  return (
    <Flag
      className="h-3.5 w-5 shrink-0 rounded-[2px] border border-border object-cover"
      aria-hidden="true"
      focusable="false"
    />
  );
}
