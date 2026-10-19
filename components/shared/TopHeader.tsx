import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

interface TopHeaderProps {
  variant?: "default" | "auth";
}

function TopHeader({ variant = "default" }: TopHeaderProps) {
  const t = useTranslations("topHeader");

  return (
    <div className="px-[3%] flex text-nowrap justify-between items-center outline-1 outline-border py-3 text-[11px] lg:text-[12px] border-b">
      <div className="flex md:gap-5 gap-2">
        <div className="flex items-center gap-1">
          <Phone size={16} />
          <p className="text-foreground">+251901964187</p>
        </div>
        <div className="text-foreground">|</div>
        <div className="flex flex-row items-center gap-3">
          <Mail size={14} />
          <div className="pt-px text-muted-foreground">Hello@abc.com</div>
        </div>
      </div>

      {variant === "auth" ? (
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <div className="text-muted-foreground">|</div>
          <LanguageSwitcher size="sm" />
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            size="sm"
          >
            {t("contactUs")}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <div className="text-muted-foreground">|</div>
          <ul className="flex gap-3 items-center">
            <li>
              <Link href={"/sign-up"}>{t("signin")}</Link>
            </li>
            <li className="text-muted-foreground">|</li>

            <li className="text-muted-foreground hidden lg:block">|</li>

            <li>
              <Link href={"/contact"}>{t("contactUs")}</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default TopHeader;
