import { Input } from "@/components/ui/input";
import { ChevronRight, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const t = useTranslations("header");
  const items = [
    { label: t("themeLight"), value: "light" },
    { label: t("themeDark"), value: "dark" },
    { label: t("themeSystem"), value: "system" },
  ];
  return (
    <div>
      <div className="flex justify-between flex-col lg:flex-row lg:w-[90%] w-[95%] m-auto py-5 ">
        <div className="flex justify-between gap-1 lg:gap-3 items-center lg:w-max m-auto lg:m-0 mb-4">
          <Globe />
          <h1 className="text-3xl md:text-2xl">{t("brand")}</h1>
        </div>
        <div className="flex justify-between">
          <Select items={items}>
            <SelectTrigger className="">
              <SelectValue placeholder={t("theme")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder={t("searchPlaceholder")}
            className="flex flex-1 md:min-w-[400px]"
          />
          <Button variant="outline">{t("search")}</Button>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Heart fill="red" />
          <Link href="/">{t("favourites")}</Link>
          <LanguageSwitcher />
          <Button variant="outline">{t("postListing")}</Button>
        </div>
        {/* Navs */}
      </div>
      <hr className="md:w-[90%] w-[95%] m-auto mb-1 " />
      <div
        className={
          "flex items-center justify-between md:w-[90%] w-[95%] m-auto  "
        }
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built with Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href="/docs/primitives/typography"
                    title="Typography"
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:flex">
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px]">
                  <li>
                    <NavigationMenuLink
                      render={
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleAlertIcon />
                          Backlog
                        </Link>
                      }
                    />
                    <NavigationMenuLink
                      render={
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleDashedIcon />
                          To Do
                        </Link>
                      }
                    />
                    <NavigationMenuLink
                      render={
                        <Link href="#" className="flex-row items-center gap-2">
                          <CircleCheckIcon />
                          Done
                        </Link>
                      }
                    />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href="/docs">Docs</Link>}
              />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 text-[14px]">
          <Link href={"/"}>{t("sellOnHub")}</Link>
          <ChevronRight size={20} />
        </div>
      </div>
      <hr className="md:w-[90%] w-[95%] m-auto mt-1" />
    </div>
  );
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  );
}
export default Header;
