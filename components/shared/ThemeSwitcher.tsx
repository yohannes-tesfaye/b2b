"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ThemeValue = "light" | "dark" | "system";

type ThemeOption = {
  value: ThemeValue;
  labelKey: "themeLight" | "themeDark" | "themeSystem";
  icon: React.ElementType;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", labelKey: "themeLight", icon: Sun },
  { value: "dark", labelKey: "themeDark", icon: Moon },
  { value: "system", labelKey: "themeSystem", icon: Monitor },
];

const emptySubscribe = () => () => {};

export default function ThemeSwitcher() {
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <Select
      value={mounted ? (theme as ThemeValue) : null}
      onValueChange={(value: ThemeValue | null) => {
        if (value) setTheme(value);
      }}
    >
      <SelectTrigger size="sm" className="text-xs" aria-label={t("theme")}>
        <SelectValue placeholder={t("theme")}>
          {(value: ThemeValue | null) => {
            const option = THEME_OPTIONS.find((o) => o.value === value);
            const Icon = option?.icon ?? Sun;
            return (
              <span className="flex items-center gap-1.5">
                <Icon className="size-4" />
                {option ? t(option.labelKey) : t("theme")}
              </span>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{t(option.labelKey)}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

