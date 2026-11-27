"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  ClipboardList,
  Heart,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { initialsFrom } from "@/lib/profile";
import { shortenText } from "@/lib/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuVariant = "default" | "compact" | "tab";

function UserMenu({
  variant = "default",
  active = false,
  unreadCount = 0,
}: {
  variant?: UserMenuVariant;
  active?: boolean;
  unreadCount?: number;
}) {
  const t = useTranslations("header");
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const tabBase =
    "relative flex h-16 w-full min-w-0 flex-col items-center justify-center gap-1 rounded-none px-1 text-[11px] font-medium transition-colors";
  const tabInactive = "text-muted-foreground hover:text-foreground";
  const tabActive = "text-primary";
  const tabUnderline = active ? (
    <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
  ) : null;

  if (isPending) {
    if (variant === "tab") {
      return (
        <div className={cn(tabBase, "text-muted-foreground")} aria-hidden="true">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      );
    }
    return <Skeleton className="h-9 w-9 rounded-full sm:h-9 sm:w-20" />;
  }

  if (!session) {
    if (variant === "tab") {
      return (
        <Link
          href="/log-in"
          aria-current={active ? "page" : undefined}
          className={cn(tabBase, tabInactive)}
        >
          <span className="relative">
            <UserRound className="size-[22px]" strokeWidth={1.75} />
          </span>
          <span className="truncate px-1">{t("bottomNav.profile")}</span>
          {tabUnderline}
        </Link>
      );
    }
    if (variant === "compact") {
      return (
        <Button
          variant="ghost"
          size="icon-lg"
          className="h-11 w-11 rounded-xl"
          aria-label={t("signIn")}
          render={<Link href="/log-in" />}
          nativeButton={false}
        >
          <UserRound className="h-5 w-5" />
        </Button>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="h-10 rounded-full px-3.5 text-sm font-medium"
          render={<Link href="/log-in" />}
          nativeButton={false}
        >
          {t("signIn")}
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-full border-border bg-transparent px-3.5 text-sm font-medium hover:bg-muted/70"
          render={<Link href="/sign-up" />}
          nativeButton={false}
        >
          {t("signUp")}
        </Button>
      </div>
    );
  }

  const u = session.user as Record<string, unknown>;
  const name = String(u.name || u.email || t("myAccount"));
  const email = String(u.email || "");
  const image = (u.image as string | null) ?? null;
  const role = String(u.role || "");
  const emailVerified = Boolean(u.emailVerified);
  const displayName = shortenText(name, 18) ?? t("myAccount");

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const quickActions = [
    {
      href: "/dashboard/listings",
      icon: ClipboardList,
      label: t("account.listings"),
    },
    {
      href: "/dashboard/favorites",
      icon: Heart,
      label: t("account.favorites"),
    },
    {
      href: "/dashboard/messages",
      icon: Inbox,
      label: t("account.messages"),
      badge: unreadCount,
    },
    {
      href: "/dashboard/listings/new",
      icon: Plus,
      label: t("account.newListing"),
    },
  ];

  const menuContent = (
    <>
      <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="ring-2 ring-background shadow-md">
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback className="text-sm font-bold">
              {initialsFrom(name || email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              {name}
            </p>
            {email ? (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            ) : null}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {role ? (
                <Badge
                  variant="secondary"
                  className="h-5 text-[10px] capitalize"
                >
                  {role}
                </Badge>
              ) : null}
              {emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("account.verified")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="relative flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-muted/60"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{action.label}</span>
              {action.badge ? (
                <span className="absolute right-2 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                  {action.badge > 9 ? "9+" : action.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <DropdownMenuSeparator className="m-0" />
      <div className="p-1.5">
        <DropdownMenuItem
          className="cursor-pointer rounded-md py-2.5"
          render={<Link href="/dashboard" />}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {t("myDashboard")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-md py-2.5"
          render={<Link href="/dashboard/profile" />}
        >
          <UserRound className="mr-2 h-4 w-4" />
          {t("profileLink")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-md py-2.5 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </div>
    </>
  );

  const contentClassName =
    "w-[min(20rem,calc(100vw-1.5rem))] max-h-[70dvh] overflow-y-auto rounded-xl p-0 shadow-lg";

  if (variant === "tab") {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(tabBase, active ? tabActive : tabInactive)}
            aria-label={t("myAccount")}
          >
            <span className="relative">
              <Avatar size="sm">
                {image ? <AvatarImage src={image} alt={name} /> : null}
                <AvatarFallback>
                  {initialsFrom(name || email)}
                </AvatarFallback>
              </Avatar>
            </span>
            <span className="truncate px-1">{t("bottomNav.profile")}</span>
            {tabUnderline}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={10}
          className={contentClassName}
        >
          {menuContent}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-2 rounded-full pr-3"
          aria-label={t("myAccount")}
        >
          <Avatar size="sm">
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback>
              {initialsFrom(name || email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-36 truncate sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={contentClassName}>
        {menuContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
