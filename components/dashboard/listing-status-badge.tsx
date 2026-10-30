import { Badge } from "@/components/ui/badge";
import { LISTING_STATUS_META, effectiveStatus } from "@/lib/listings";

export function ListingStatusBadge({
  status,
  expiresAt,
}: {
  status: string;
  expiresAt: Date | string | null;
}) {
  const effective = effectiveStatus({ status, expiresAt });
  const meta = LISTING_STATUS_META[effective];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
