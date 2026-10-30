import { Building2, Calendar, CheckCircle2, Globe, Link, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { initialsFrom } from "@/lib/profile";
import type { UserRow } from "./user-list";

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
    <div className="flex items-start gap-3">
      <Icon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm text-foreground truncate">{value}</span>
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

export function UserCard({ user }: { user: UserRow }) {
  const complete = [user.companyName, user.country, user.industry, user.companySize].filter(Boolean).length;
  const pct = Math.round((complete / 4) * 100);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="text-lg">{initialsFrom(user.name || user.email)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-xl">{user.name || "Unnamed"}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            {user.email}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant={roleVariant(user.role || "buyer")}>{user.role || "buyer"}</Badge>
            {user.banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline">Active</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoRow icon={Building2} label="Company" value={user.companyName || "—"} />
        <InfoRow icon={Globe} label="Country" value={user.country || "—"} />
        <InfoRow icon={Link} label="Industry" value={user.industry || "—"} />
        <InfoRow icon={Link} label="Company size" value={user.companySize || "—"} />
        <InfoRow icon={Phone} label="Phone" value={user.phone || "—"} />
        <InfoRow icon={Link} label="Website" value={user.website || "—"} />
        <InfoRow icon={Calendar} label="Joined" value={user.createdAt.toLocaleDateString()} />
        <InfoRow
          icon={CheckCircle2}
          label="Email verified"
          value={user.emailVerified ? "Yes" : "No"}
        />
        {user.banned && user.banReason ? (
          <div className="md:col-span-2 flex items-start gap-3">
            <span className="text-muted-foreground shrink-0">Ban reason:</span>
            <span className="text-sm text-destructive">{user.banReason}</span>
          </div>
        ) : null}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
