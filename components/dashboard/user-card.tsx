import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { initialsFrom } from "@/lib/profile";
import type { UserRow } from "./user-list";

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
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">{user.role || "buyer"}</Badge>
            {user.banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline">Active</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="text-muted-foreground">Company:</span> {user.companyName || "—"}</div>
        <div><span className="text-muted-foreground">Country:</span> {user.country || "—"}</div>
        <div><span className="text-muted-foreground">Industry:</span> {user.industry || "—"}</div>
        <div><span className="text-muted-foreground">Company size:</span> {user.companySize || "—"}</div>
        <div><span className="text-muted-foreground">Joined:</span> {user.createdAt.toLocaleDateString()}</div>
        <div><span className="text-muted-foreground">Profile completion:</span> {pct}%</div>
        {user.banned && user.banReason ? (
          <div className="md:col-span-2"><span className="text-muted-foreground">Ban reason:</span> {user.banReason}</div>
        ) : null}
        <div className="md:col-span-2">
          <Progress value={pct} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
