"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
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
            <span>{Math.round(([user.companyName, user.country, user.industry, user.companySize].filter(Boolean).length / 4) * 100)}%</span>
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
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useSidebar();

  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } });
  };

  const canShowProfile = state === "expanded";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative">
          <div
            className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors cursor-pointer w-full"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="User profile"
          >
<Avatar className="h-8 w-8 shrink-0">
  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
  <AvatarFallback>{initialsFrom(user.name || user.email)}</AvatarFallback>
</Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name || "User"}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              {user.role ? (
                <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                  {user.role}
                </Badge>
              ) : null}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden" />
          </div>

          {canShowProfile && isOpen && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <ProfileCard
                user={{
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
                }}
              />
            </div>
          )}

<button
  onClick={handleSignOut}
  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:hidden"
  aria-label="Sign out"
>
  <LogOut className="h-4 w-4" />
</button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
