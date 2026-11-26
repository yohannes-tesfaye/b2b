import { prisma } from "@/lib/prisma";

export type ApprovalSettings = {
  listingApprovalEnabled: boolean;
  autoApproveVerified: boolean;
};

/**
 * Load the singleton approval settings, creating the default row if missing.
 */
export async function getApprovalSettings(): Promise<ApprovalSettings> {
  const row = await prisma.appSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  return {
    listingApprovalEnabled: row.listingApprovalEnabled,
    autoApproveVerified: row.autoApproveVerified,
  };
}

/**
 * Decide the initial status of a newly created listing.
 * - Approval off: active.
 * - Auto-approve verified users on and user is verified and not flagged: active.
 * - Otherwise: pending review.
 */
export function determineListingStatus(
  user: { emailVerified: boolean; requiresReview: boolean },
  settings: ApprovalSettings
): "active" | "pending" {
  if (!settings.listingApprovalEnabled) return "active";
  if (
    settings.autoApproveVerified &&
    user.emailVerified &&
    !user.requiresReview
  ) {
    return "active";
  }
  return "pending";
}
