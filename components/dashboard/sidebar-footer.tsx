"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { initialsFrom } from "@/lib/profile";

export function SidebarUserFooter({
  user,
}: {
  user: { name: string; email: string; image?: string | null; role?: string | null };
}) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } });
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 rounded-md p-2">
          <Avatar className="h-9 w-9">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback>{initialsFrom(user.name || user.email)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-medium">{user.name || "User"}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            {user.role ? (
              <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                {user.role}
              </Badge>
            ) : null}
          </div>
          <button
            onClick={handleSignOut}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
