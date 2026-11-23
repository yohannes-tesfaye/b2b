"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
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

function UserMenu({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("header");
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <Skeleton className="h-9 w-9 rounded-full sm:h-9 sm:w-20" />;
  }

  if (!session) {
    if (compact) {
      return (
        <Button
          variant="ghost"
          size="icon-lg"
          className="h-10 w-10 rounded-xl"
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

  const user = session.user;
  const displayName =
    shortenText(user.name || user.email, 18) ?? t("myAccount");
  const fullDisplayName =
    shortenText(user.name || t("myAccount"), 28) ?? t("myAccount");

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-2 rounded-full pr-3"
          aria-label={t("myAccount")}
        >
          <Avatar size="sm">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback>
              {initialsFrom(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-36 truncate sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            <div className="truncate text-sm font-medium">{fullDisplayName}</div>
            {user.email ? (
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/${user.id}/dashboard`} />}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {t("myDashboard")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/${user.id}/dashboard/profile`} />}
        >
          <UserRound className="mr-2 h-4 w-4" />
          {t("profileLink")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;

