import { Badge } from "@/components/ui/badge";
import { roleLabel } from "@/lib/listings";
import { parseRoles } from "@/lib/profile";

function variantFor(role: string) {
  if (role === "admin" || role === "superadmin") return "outline" as const;
  if (role === "supplier") return "default" as const;
  return "secondary" as const;
}

export function RoleBadges({ role }: { role: string | null | undefined }) {
  const roles = parseRoles(role);

  if (!roles.length) {
    return <Badge variant="outline">No role selected</Badge>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {roles.map((value) => (
        <Badge key={value} variant={variantFor(value)}>
          {roleLabel(value)}
        </Badge>
      ))}
    </div>
  );
}
