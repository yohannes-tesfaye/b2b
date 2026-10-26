import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initialsFrom } from "@/lib/profile";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  companyName: string | null;
  country: string | null;
  industry: string | null;
  companySize: string | null;
  phone: string | null;
  website: string | null;
  emailVerified: boolean | null;
  createdAt: Date;
};

export function UserList({ users }: { users: UserRow[] }) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No users found.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {users.map((u) => (
        <Card key={u.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                {u.image ? <AvatarImage src={u.image} alt={u.name} /> : null}
                <AvatarFallback>{initialsFrom(u.name || u.email)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium truncate">{u.name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{u.role || "buyer"}</Badge>
              {u.banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline">Active</Badge>}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>{u.companyName || "—"} · {u.country || "—"}</div>
              <div>{u.industry || "—"} · {u.companySize || "—"}</div>
            </div>
            <Button render={<Link href={`/users/${u.id}`} />} size="sm" className="w-full">View details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
