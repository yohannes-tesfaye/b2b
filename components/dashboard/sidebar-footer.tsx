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
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Globe,
  LogOut,
  Phone,
  UserRound,
  Users,
  Factory,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/navigation";
import { initialsFrom } from "@/lib/profile";
import { Progress } from "@/components/ui/progress";

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

  const complete = [user.companyName, user.country, user.industry, user.companySize].filter(Boolean).length;
  const pct = Math.round((complete / 4) * 100);

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

  const quickInfo = [
    { icon: Building2, label: "Company", value: user.companyName },
    { icon: Globe, label: "Country", value: user.country },
    { icon: Factory, label: "Industry", value: user.industry },
    { icon: Users, label: "Size", value: user.companySize },
  ];

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
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-sidebar-border">
                {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                <AvatarFallback className="rounded-lg text-xs font-semibold">
                  {initialsFrom(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold">{user.name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronDown className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 overflow-hidden rounded-xl p-0 shadow-lg"
            side="top"
            align="end"
            sideOffset={6}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                  <AvatarFallback className="text-sm font-bold">
                    {initialsFrom(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {user.name || "Unnamed"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <Badge
                    variant={roleVariant(user.role || "buyer")}
                    className="mt-1.5 h-5 text-[10px] capitalize"
                  >
                    {user.role || "buyer"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-px bg-border/60">
              {quickInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-popover px-3 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="truncate text-xs font-medium">
                        {item.value || "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact details */}
            {(user.phone || user.website) ? (
              <div className="space-y-1 px-4 py-3">
                {user.phone ? (
                  <a
                    href={`tel:${user.phone}`}
                    className="flex items-center gap-2.5 rounded-md px-1 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.phone}</span>
                  </a>
                ) : null}
                {user.website ? (
                  <a
                    href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-md px-1 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {user.website.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}

            {/* Profile completion */}
            <div className="px-4 py-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium">Profile completion</span>
                <span className="text-muted-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {user.createdAt ? user.createdAt.toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className={`h-3 w-3 ${user.emailVerified ? "text-emerald-500" : "text-muted-foreground"}`} />
                  {user.emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>

            {user.banned && user.banReason ? (
              <div className="mx-4 mb-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wide text-destructive">
                  Ban reason
                </p>
                <p className="mt-0.5 text-xs text-destructive">{user.banReason}</p>
              </div>
            ) : null}

            <DropdownMenuSeparator className="m-0" />
            <div className="p-1.5">
              <DropdownMenuItem
                className="cursor-pointer rounded-md"
                render={<Link href="/dashboard/profile" />}
              >
                <UserRound className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-md text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
