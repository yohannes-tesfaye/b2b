"use client";

import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, authClient } from "@/lib/auth-client";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserMenu() {
  const t = useTranslations("header");
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-20" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost">
          <Link href="/log-in">{t("signIn")}</Link>
        </Button>
        <Button>
          <Link href="/sign-up">{t("signUp")}</Link>
        </Button>
      </div>
    );
  }

  const user = session.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          aria-label={t("myAccount")}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          <div className="text-sm font-medium">{user.name || t("myAccount")}</div>
          {user.email ? (
            <div className="truncate text-xs text-muted-foreground">
              {user.email}
            </div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
