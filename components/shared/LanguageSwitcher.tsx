"use client";

import { useLocale, useTranslations, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LanguageSwitcher({
  size = "default",
  className,
}: {
  size?: "sm" | "default";
  className?: string;
}) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { value: "en", label: t("en") },
    { value: "am", label: t("am") },
  ];

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        if (hasLocale(routing.locales, value)) {
          router.replace(pathname, { locale: value });
        }
      }}
    >
      <SelectTrigger size={size} className={className} aria-label={t("label")}>
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LanguageSwitcher;