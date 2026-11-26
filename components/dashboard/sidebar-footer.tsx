"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/navigation";
import { initialsFrom } from "@/lib/profile";
import { UserRow } from "./user-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, CheckCircle2, Globe, Link as LinkIcon, Phone } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-xs text-foreground truncate">{value}</span>
      </div>
    </div>
  );
}

function roleVariant(role: string) {
  switch (role) {
    case "superadmin":
      return "secondary";
    case "admin":
      return "outline";
    default:
      return "default";
  }
}

function ProfileCard({ user }: { user: UserRow }) {
  const complete = [user.companyName, user.country, user.industry, user.companySize].filter(Boolean).length;
  const pct = Math.round((complete / 4) * 100);

  return (
    <Card className="w-80">
      <CardHeader className="flex flex-row items-center gap-3 px-4 py-3">
        <Avatar className="h-10 w-10">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{initialsFrom(user.name || user.email)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm truncate">{user.name || "Unnamed"}</CardTitle>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          <Badge variant={roleVariant(user.role || "buyer")} className="mt-1 h-5 text-[10px]">
            {user.role || "buyer"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-2 text-xs">
        <InfoRow icon={Building2} label="Company" value={user.companyName || "—"} />
        <InfoRow icon={Globe} label="Country" value={user.country || "—"} />
        <InfoRow icon={LinkIcon} label="Industry" value={user.industry || "—"} />
        <InfoRow icon={LinkIcon} label="Company size" value={user.companySize || "—"} />
        <InfoRow icon={Phone} label="Phone" value={user.phone || "—"} />
        <InfoRow icon={LinkIcon} label="Website" value={user.website || "—"} />
        <InfoRow icon={Calendar} label="Joined" value={user.createdAt.toLocaleDateString()} />
        <InfoRow
          icon={CheckCircle2}
          label="Email verified"
          value={user.emailVerified ? "Yes" : "No"}
        />
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Profile completion</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
        {user.banned && user.banReason ? (
          <div className="mt-2 text-destructive">
            <div className="text-[10px] text-muted-foreground">Ban reason</div>
            <div className="text-xs">{user.banReason}</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SidebarUserFooter({
  user,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
    companyName?: string | null;
    country?: string | null;
    industry?: string | null;
    companySize?: string | null;
    phone?: string | null;
    website?: string | null;
    emailVerified?: boolean | null;
    banned?: boolean | null;
    banReason?: string | null;
    createdAt?: Date | null;
  };
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } });
  };

  const profileUser = {
    id: "",
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role ?? null,
    banned: user.banned ?? null,
    banReason: user.banReason ?? null,
    companyName: user.companyName ?? null,
    country: user.country ?? null,
    industry: user.industry ?? null,
    companySize: user.companySize ?? null,
    phone: user.phone ?? null,
    website: user.website ?? null,
    emailVerified: user.emailVerified ?? null,
    createdAt: user.createdAt ?? new Date(),
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={user.name || "Account"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                <AvatarFallback className="rounded-lg">
                  {initialsFrom(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold">{user.name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronDown className="ml-auto size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 max-h-[70vh] overflow-y-auto rounded-lg p-0"
            side="top"
            align="end"
            sideOffset={4}
          >
            <div className="p-2">
              <ProfileCard user={profileUser as unknown as UserRow} />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer mx-2 mb-1"
              render={<Link href="/dashboard/profile" />}
            >
              <UserRound className="mr-2 h-4 w-4" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer mx-2 mb-2 text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
